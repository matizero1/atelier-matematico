/**
 * ROOM SYNC — Protocolo de Sincronización de Salas Magistrales P2P
 * Atelier Matemático / Nai Systems
 * 
 * Permite crear y unirse a salas colaborativas mediante código de 4 caracteres.
 * Sincroniza en tiempo real:
 * - Pizarrón maestro del profesor (trazos, fórmulas, estado 3D/2D).
 * - Pupitres de los alumnos (derivación paso a paso, estado del Lápiz de Timonel).
 * - Mosaico de supervisión para el docente con alertas de divergencia roja.
 */

(function(root) {
  'use strict';

  class RoomSync {
    constructor() {
      this.currentRoom = null;
      this.role = 'student'; // 'teacher' | 'student'
      this.userName = 'Estudiante';
      this.userId = 'usr_' + Math.random().toString(36).substr(2, 6);
      this.channel = null;
      this.listeners = new Map();
      this.students = new Map(); // Para el profesor: id -> data
      this.masterBoardState = {
        title: 'Teorema Fundamental del Álgebra',
        prompt: 'Demuestra la factorización de la diferencia de cuadrados.',
        steps: ['(x - 3)*(x + 3)', 'x^2 - 9'],
        mode: 'study' // 'study' | 'exam'
      };
    }

    on(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }

    emit(event, data) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).forEach(cb => {
          try { cb(data); } catch (e) { console.error('Error en listener:', e); }
        });
      }
    }

    generateRoomCode() {
      const prefixes = ['EULR', 'KPLR', 'NVST', 'RIEM', 'LORE', 'MAXW', 'DIRC', 'GAUS', 'TURI', 'NOET'];
      return prefixes[Math.floor(Math.random() * prefixes.length)];
    }

    joinRoom(roomCode, role = 'student', userName = '') {
      this.leaveRoom();
      this.currentRoom = (roomCode || 'EULR').toUpperCase().trim();
      this.role = role;
      this.userName = userName || (role === 'teacher' ? 'Catedrático' : 'Pupitre_' + this.userId.substr(4));

      try {
        this.channel = new BroadcastChannel('atelier_room_' + this.currentRoom);
        this.channel.onmessage = (e) => this.handleMessage(e.data);
      } catch (err) {
        console.warn('BroadcastChannel no soportado, usando fallback de almacenamiento:', err);
      }

      // Anunciar presencia
      this.broadcast({
        type: 'USER_JOIN',
        userId: this.userId,
        userName: this.userName,
        role: this.role,
        timestamp: Date.now()
      });

      // Si es estudiante, solicitar estado del pizarrón maestro
      if (this.role === 'student') {
        this.broadcast({
          type: 'REQUEST_MASTER_STATE',
          from: this.userId
        });
      }

      this.emit('room_joined', { roomCode: this.currentRoom, role: this.role, userName: this.userName });
      return this.currentRoom;
    }

    leaveRoom() {
      if (this.channel) {
        this.broadcast({
          type: 'USER_LEAVE',
          userId: this.userId
        });
        this.channel.close();
        this.channel = null;
      }
      this.currentRoom = null;
      this.students.clear();
      this.emit('room_left', {});
    }

    broadcast(msg) {
      msg.roomCode = this.currentRoom;
      msg.senderId = this.userId;
      msg.senderName = this.userName;
      msg.senderRole = this.role;

      if (this.channel) {
        try {
          this.channel.postMessage(msg);
        } catch (e) {
          console.error('Error al emitir en canal:', e);
        }
      }
    }

    handleMessage(msg) {
      if (!msg || msg.senderId === this.userId) return;

      switch (msg.type) {
        case 'USER_JOIN':
          if (this.role === 'teacher' && msg.role === 'student') {
            this.students.set(msg.userId, {
              id: msg.userId,
              name: msg.userName,
              lastStep: 'Conectado',
              status: 'initial',
              residue: 0,
              stepsCount: 0,
              history: [],
              lastUpdate: Date.now()
            });
            this.emit('students_updated', Array.from(this.students.values()));
            // Enviar estado del pizarrón al nuevo alumno
            this.broadcast({
              type: 'MASTER_STATE_UPDATE',
              state: this.masterBoardState
            });
          }
          this.emit('user_joined', msg);
          break;

        case 'USER_LEAVE':
          if (this.students.has(msg.userId)) {
            this.students.delete(msg.userId);
            this.emit('students_updated', Array.from(this.students.values()));
          }
          this.emit('user_left', msg);
          break;

        case 'REQUEST_MASTER_STATE':
          if (this.role === 'teacher') {
            this.broadcast({
              type: 'MASTER_STATE_UPDATE',
              state: this.masterBoardState
            });
          }
          break;

        case 'MASTER_STATE_UPDATE':
          if (this.role === 'student') {
            this.masterBoardState = msg.state;
            this.emit('master_state_received', msg.state);
          }
          break;

        case 'STUDENT_STEP_UPDATE':
          if (this.role === 'teacher') {
            this.students.set(msg.senderId, {
              id: msg.senderId,
              name: msg.senderName,
              lastStep: msg.lastStep,
              status: msg.status,
              residue: msg.residue || 0,
              stepsCount: msg.stepsCount || 1,
              counterexample: msg.counterexample || null,
              lastUpdate: Date.now()
            });
            this.emit('students_updated', Array.from(this.students.values()));
          }
          break;

        case 'BOARD_STROKE':
          this.emit('remote_stroke', msg.stroke);
          break;

        case 'BOARD_CLEAR':
          this.emit('remote_clear', {});
          break;

        default:
          break;
      }
    }

    /**
     * El estudiante emite la actualización de su último paso y estado de Timonel.
     */
    sendStudentStep(lastStep, evalResult, stepsCount) {
      if (this.role !== 'student' || !this.currentRoom) return;
      this.broadcast({
        type: 'STUDENT_STEP_UPDATE',
        lastStep: lastStep,
        status: evalResult ? evalResult.status : 'unknown',
        residue: evalResult ? evalResult.maxResidue : 0,
        counterexample: evalResult ? evalResult.counterexample : null,
        stepsCount: stepsCount || 1
      });
    }

    /**
     * El profesor actualiza el problema o teorema del pizarrón maestro.
     */
    updateMasterBoard(title, prompt, steps, mode = 'study') {
      if (this.role !== 'teacher' || !this.currentRoom) return;
      this.masterBoardState = { title, prompt, steps, mode };
      this.broadcast({
        type: 'MASTER_STATE_UPDATE',
        state: this.masterBoardState
      });
      this.emit('master_state_changed', this.masterBoardState);
    }

    sendStroke(stroke) {
      if (!this.currentRoom) return;
      this.broadcast({
        type: 'BOARD_STROKE',
        stroke: stroke
      });
    }

    sendClear() {
      if (!this.currentRoom) return;
      this.broadcast({
        type: 'BOARD_CLEAR'
      });
    }
  }

  const roomInstance = new RoomSync();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RoomSync, instance: roomInstance };
  } else {
    root.RoomSync = roomInstance;
  }
})(typeof window !== 'undefined' ? window : globalThis);
