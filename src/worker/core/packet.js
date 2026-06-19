import { Buffer } from 'buffer';
import { HEADER_SIZE } from './constants.js';

export function parseHeader(buffer) {
  if (!buffer || buffer.length < HEADER_SIZE) return null;
  return {
    fromPeerId: buffer.readUInt32LE(0),
    toPeerId: buffer.readUInt32LE(4),
    packetType: buffer.readUInt8(8),
    flags: buffer.readUInt8(9),
    forwardCounter: buffer.readUInt8(10),
    reserved: buffer.readUInt8(11),
    len: buffer.readUInt32LE(12),
  };
}

export function createHeader(fromPeerId, toPeerId, packetType, payloadLen, flags = 0, forwardCounter = 1) {
  const buffer = Buffer.alloc(HEADER_SIZE);
  
  // 【新增功能】：注入 Latency First 标志位 (0x02)
  let finalFlags = flags;
  if (process.env.EASYTIER_LATENCY_FIRST === "1") {
    finalFlags |= 0x02;
  }

  buffer.writeUInt32LE(fromPeerId, 0);
  buffer.writeUInt32LE(toPeerId, 4);
  buffer.writeUInt8(packetType, 8);
  buffer.writeUInt8(finalFlags, 9); // 写入混合后的 flags
  buffer.writeUInt8(forwardCounter, 10);
  buffer.writeUInt8(0, 11);
  buffer.writeUInt32LE(payloadLen, 12);
  
  return buffer;
}
