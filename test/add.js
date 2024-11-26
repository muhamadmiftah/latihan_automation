import supertest from "supertest";
import { expect } from "chai"; // Untuk assertion
const request = supertest("https://gorest.co.in/public/v2");

const token = "ebecd22435bc49add03ede5e0f1ece443389094798df62cbcd4f6c3b68f832f4";


describe("users", () => {
    
    it("GET /users", async () => {
        const res = await request.get("/users");
        
        // Assertion
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
        console.log(res.body);
    });

    it("GET /users?id", async () => {
        const userId = 7543746; // Ganti dengan ID yang valid
        const res = await request.get(`/users?id=${userId}`);
    
        console.log("Status:", res.status);
        console.log("Response Body:", res.body);
    
        // Tangani jika respons kosong
        if (res.body.length === 0) {
            console.warn(`No users found with id=${userId}`);
        } else {
            // Periksa apakah respons berupa array atau objek
            if (Array.isArray(res.body)) {
                expect(res.body).to.be.an("array").that.is.not.empty;
                expect(res.body[0]).to.have.property("id", userId); // Periksa ID pertama dalam array
            } else {
                expect(res.body).to.be.an("object").that.has.property("id");
                expect(res.body.id).to.equal(userId);
            }
        }
    });

    it("GET /users?gender", async () => {
        const usersgender = "female"; // Contoh gender
        const res = await request.get(`/users?gender=${usersgender}`);
        
        // Log respons untuk debugging
        console.log(res.body);

        // Periksa status kode
        expect(res.status).to.equal(200);

        // Periksa apakah respons berupa array atau objek
        if (Array.isArray(res.body)) {
            expect(res.body).to.be.an("array").that.is.not.empty;
        } else {
            expect(res.body).to.be.an("object").that.has.property("id");
            expect(res.body.id).to.equal(usersgender);
        }
    });

    it("GET /users?gender&status", async () => {
        
        const usersgender = "female"; // Contoh gender
        const usersstatus = "active"; // Contoh status
        const res = await request.get(`/users?gender=${usersgender}&status=${usersstatus}`);
        
        // Log respons untuk debugging
        console.log("Response Body:", res.body);

        // Periksa apakah respons berupa array atau objek
        expect(res.status).to.equal(200);
        if (res.body.length === 0) {
            console.warn("No users found with the given filters.");
        } else {
            expect(res.body).to.be.an("array").that.is.not.empty;
            res.body.forEach(user => {
                expect(user).to.have.property("gender", usersgender);
                expect(user).to.have.property("status", usersstatus);
            });
        }
    });

    it("GET /users last added", async () => {
        
        const res = await request.get("/users").set("Authorization", `Bearer ${token}`);
    
        // Log respons untuk debugging
        console.log("Response Body:", res.body);
    
        // Pastikan respons adalah array
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array").that.is.not.empty;
    
        // Cari user dengan ID terbesar
        const userslastid = res.body.reduce((prev, current) => {
            return current.id > prev.id ? current : prev;
        });
    
        console.log("id User terakhir: ", userslastid);
    
        // Verifikasi hasil
        expect(userslastid).to.have.property("id");
        expect(userslastid).to.have.property("name");
    });

    it("POST /users", async () => {    
        const email = `test${Date.now()}@mailservice.com`; // Email unik
        const name = `Test Pride ${Date.now()}`; //nama unik
        const data = {
            email: email,
            name: name,
            gender: "male",
            status: "active",
        };
    
        const res = await request
            .post("/users")
            .set("Authorization", `Bearer ${token}`) // Format token yang benar
            .set("Content-Type", "application/json")
            .send(data);
    
        console.log("Status:", res.status);
        console.log("Response Body:", res.body);
    
        // Verifikasi respons
        expect(res.status).to.equal(201); // 201 Created
        expect(res.body).to.have.property("id");
        expect(res.body.email).to.equal(data.email);
        expect(res.body.name).to.equal(data.name);
        expect(res.body.gender).to.equal(data.gender);
        expect(res.body.status).to.equal(data.status);
    });

    it("PUT /users/:id", async () => {   
        const name = `Test Pride ${Date.now()}`;
        const email = `test${Date.now()}@mailservice.com`;
        const data = {
            status: "inactive",
            name: name,
            email: email
        };
        
        const res = await request
            .put("/users/7538600")
            .set("Authorization", `Bearer ${token}`) // Format token yang benar
            .set("Content-Type", "application/json")
            .send(data);
        
        console.log("Response Body:", res.body);
    });
});
