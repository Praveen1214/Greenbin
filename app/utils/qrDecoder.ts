// utils/qrDecoder.ts
export const decodeQRData = (data: string) => {
    try {
      const decodedData = decodeURIComponent(data);
      const bookingDetails = JSON.parse(decodedData);
      return bookingDetails;
    } catch (error) {
      throw new Error('Failed to decode QR data');
    }
  };
  