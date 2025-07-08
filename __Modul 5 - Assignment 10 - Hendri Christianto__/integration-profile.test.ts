/**
 * @jest-environment jsdom
 */
// __tests__/integration-profile.test.ts
// Integration test untuk whitebox testing pada alur login dan update profile

import { describe, it, expect } from "@jest/globals";
import { POST as loginHandler } from "../src/app/api/login/route";
import { PUT as profileHandler } from "../src/app/api/profile/route";

describe("Integration: Login and Update Profile", () => {
  it("should return 400 if email or password missing", async () => {
    const req = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({ email: "", password: "" }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await loginHandler(req as any);
    expect(result.status).toBe(400);
  });

  it("should return 200 for valid login", async () => {
    const req = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await loginHandler(req as any);
    expect(result.status).toBe(200);
  });

  it("should return 400 for invalid profile data", async () => {
    const req = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({
        username: "usr",
        fullName: "",
        email: "bad",
        phone: "123",
        birthDate: "3000-01-01",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await profileHandler(req as any);
    expect(result.status).toBe(400);
  });

  it("should return 400 for password less than 6 characters", async () => {
    const req = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "123" }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await loginHandler(req as any);
    expect(result.status).toBe(400);
  });

  it("should return 401 for invalid credentials", async () => {
    const req = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: "wrong@example.com",
        password: "wrongpass",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await loginHandler(req as any);
    expect(result.status).toBe(401);
  });

  it("should return 400 for bio too long in profile update", async () => {
    const req = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({
        username: "username",
        fullName: "Full Name",
        email: "test@example.com",
        phone: "081234567890",
        birthDate: "2000-01-01",
        bio: "a".repeat(161),
      }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await profileHandler(req as any);
    expect(result.status).toBe(400);
  });

  it("should return 200 for valid profile update", async () => {
    const req = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({
        username: "username",
        fullName: "Full Name",
        email: "test@example.com",
        phone: "081234567890",
        birthDate: "2000-01-01",
        bio: "short bio",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await profileHandler(req as any);
    expect(result.status).toBe(200);
  });

  it("should return 400 for birthDate in the future", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // besok
    const req = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({
        username: "username",
        fullName: "Full Name",
        email: "test@example.com",
        phone: "081234567890",
        birthDate: futureDate.toISOString().split("T")[0],
        bio: "short bio",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await profileHandler(req as any);
    expect(result.status).toBe(400);
  });

  it("should return 400 for phone missing in profile update", async () => {
    const req = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({
        username: "username",
        fullName: "Full Name",
        email: "test@example.com",
        phone: "", // phone kosong
        birthDate: "2000-01-01",
        bio: "short bio",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await profileHandler(req as any);
    expect(result.status).toBe(400);
  });

  it("should return 400 for phone not 10-15 digits in profile update", async () => {
    const req = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({
        username: "username",
        fullName: "Full Name",
        email: "test@example.com",
        phone: "12345", // kurang dari 10 digit
        birthDate: "2000-01-01",
        bio: "short bio",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await profileHandler(req as any);
    expect(result.status).toBe(400);
  });

  it("should return 400 for phone not numeric in profile update", async () => {
    const req = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({
        username: "username",
        fullName: "Full Name",
        email: "test@example.com",
        phone: "abcdefghij", // 10 karakter tapi bukan angka
        birthDate: "2000-01-01",
        bio: "short bio",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await profileHandler(req as any);
    expect(result.status).toBe(400);
  });

  it("should return 400 for phone more than 15 digits in profile update", async () => {
    const req = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({
        username: "username",
        fullName: "Full Name",
        email: "test@example.com",
        phone: "1234567890123456", // 16 digit
        birthDate: "2000-01-01",
        bio: "short bio",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await profileHandler(req as any);
    expect(result.status).toBe(400);
  });
  // Tambahkan skenario lain untuk branch coverage jika ada logika lain
});
