import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();
const PORT = 4000;


app.use(cors());
app.use(express.json());

app.get("/students", async (req, res) => {
    try {
        const response = await db.query(`SELECT * FROM students ORDER BY id ASC`);
        res.status(200).send({ status: "success", students: response.rows });
    }
    catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

app.post("/student", async (req, res) => {
    try {
        const body = req.body;

        if (!body.first_name || !body.last_name || !body.course || !body.batch || !body.roll_number || !body.age) {
            return res.status(400).send({ status: "error", message: "Required Parameter Missing!" });
        };
        const response = await db.query(`INSERT INTO students (
        first_name, last_name, course, batch, roll_number, age) VALUES(
        $1, $2, $3, $4, $5, $6) RETURNING *`, [body.first_name, body.last_name, body.course, body.batch, body.roll_number, body.age]);
        res.status(201).send({ status: "success", message: "Student Added Successfully", student: response.rows[0] })
    }
    catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }


});


app.put("/student/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;

        if (!body.first_name || !body.last_name || !body.course || !body.batch || !body.roll_number || !body.age) {
            return res.status(400).send({ status: "error", message: "Required Parameter Missing!" });
        };

        const response = await db.query(`UPDATE students SET
            first_name = $1, last_name = $2, course = $3, batch = $4, roll_number = $5, age = $6 WHERE id = $7 RETURNING *`,
            [body.first_name, body.last_name, body.course, body.batch, body.roll_number, body.age, id]);

        if (response.rows.length === 0) {
            return res.status(404).send({ status: "error", message: `Student not found with id ${id}` })
        }

        res.status(200).send({ status: "success", message: "Student Updated Successfully", student: response.rows[0] });

    }
    catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }

});


app.delete("/student/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const response = await db.query(`DELETE FROM students WHERE id = $1 RETURNING *`, [id]);

        if (response.rows.length === 0) {
            return res.status(404).send({ status: "error", message: `Student not found with id ${id}` })
        }

        res.status(200).send({ status: "success", message: "Student Deleted Successfully", student: response.rows[0] });

    }
    catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});



app.listen(PORT, () => {
    console.log("Server Running on Port", PORT);
})
