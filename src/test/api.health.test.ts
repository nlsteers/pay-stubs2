import type { NextApiRequest, NextApiResponse } from "next"
import handler from "../pages/api/health"

describe("/api/hello", () => {
  it("returns a 200 response with the message \x22Hello world\x22", async () => {
    const mockReq: Partial<NextApiRequest> = {
      method: "GET",
    };

    const mockRes: Partial<NextApiResponse> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Hello world" });
  })
})
