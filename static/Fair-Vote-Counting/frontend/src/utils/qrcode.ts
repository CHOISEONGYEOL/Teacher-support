/**
 * QR 코드 생성 유틸리티
 */
import QRCode from 'qrcode';

/**
 * QR 코드를 Data URL로 생성
 * @param data QR에 인코딩할 데이터 (URL 등)
 * @returns Base64 Data URL
 */
export async function generateQRDataURL(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('QR 코드 생성 실패:', err);
    throw err;
  }
}

/**
 * 투표방 접속 URL 생성
 */
export function getJoinURL(roomCode: string): string {
  const baseURL = window.location.origin;
  return `${baseURL}/join/${roomCode}`;
}

/**
 * 투표방 QR 코드 생성
 */
export async function generateRoomQR(roomCode: string): Promise<{
  roomCode: string;
  qrDataURL: string;
  joinURL: string;
}> {
  const joinURL = getJoinURL(roomCode);
  const qrDataURL = await generateQRDataURL(joinURL);

  return {
    roomCode,
    qrDataURL,
    joinURL,
  };
}
