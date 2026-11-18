const crypto = require('crypto');
const QRCode = require('qrcode');
const config = require('../config/config');

/**
 * Generate cryptographically secure signature for event ticket
 */
function createSignature(ticketId, eventId, userId) {
  const data = `${ticketId}:${eventId}:${userId}`;
  return crypto
    .createHmac('sha256', config.QR_HMAC_SECRET)
    .update(data)
    .digest('hex');
}

/**
 * Generate unique Ticket ID with prefix EN-YYYY
 */
function generateTicketId() {
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `EN-${year}-${rand}`;
}

/**
 * Build verifiable QR payload string
 */
function generateQRPayload(ticketId, eventId, userId) {
  const signature = createSignature(ticketId, eventId, userId);
  const payload = {
    tkt: ticketId,
    eid: eventId.toString(),
    uid: userId.toString(),
    sig: signature,
    app: 'EventNest'
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Generate QR Code as Data URI (base64 image)
 */
async function generateQRCodeImage(payloadString) {
  try {
    return await QRCode.toDataURL(payloadString, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('[QRCode Generation Error]', err);
    throw new Error('Failed to generate QR Code image');
  }
}

/**
 * Verify scanned QR code payload
 * Returns { valid: boolean, error?: string, payload?: object }
 */
function verifyQRPayload(encodedString, expectedEventId = null) {
  try {
    const decodedText = Buffer.from(encodedString, 'base64').toString('utf-8');
    const payload = JSON.parse(decodedText);

    if (!payload.tkt || !payload.eid || !payload.uid || !payload.sig || payload.app !== 'EventNest') {
      return { valid: false, error: 'Invalid QR Code format: Not an official EventNest pass' };
    }

    // Verify cryptographic signature
    const expectedSig = createSignature(payload.tkt, payload.eid, payload.uid);
    if (expectedSig !== payload.sig) {
      return { valid: false, error: 'Security alert: QR signature verification failed (Tampered Pass)' };
    }

    // Verify event ID if specified
    if (expectedEventId && payload.eid !== expectedEventId.toString()) {
      return { valid: false, error: 'This ticket was issued for a different event' };
    }

    return {
      valid: true,
      ticketId: payload.tkt,
      eventId: payload.eid,
      userId: payload.uid
    };
  } catch (err) {
    return { valid: false, error: 'Malformed or unreadable QR code payload' };
  }
}

module.exports = {
  generateTicketId,
  generateQRPayload,
  generateQRCodeImage,
  verifyQRPayload
};
