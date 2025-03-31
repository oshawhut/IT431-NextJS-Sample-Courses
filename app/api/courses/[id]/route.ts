import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Course } from "@/types/course";
import { ObjectId } from "mongodb";

// GET: Retrieve a course by ID
export async function GET(
	request: Request,
	context: { params: Promise<{ id: string }> } // Await params
) {
	try {
		const { id } = await context.params; // Await params before accessing
		const courseId = parseInt(id, 10);

		// if (isNaN(courseId)) {
		// 	return NextResponse.json(
		// 		{ error: "Invalid course ID." },
		// 		{ status: 400 }
		// 	);
		// }

		const client = await clientPromise;
		const db = client.db("coursesDb");
		// const course = await db
		// 	.collection("courses")
		// 	.findOne({ _id: new ObjectId(id) });

		const course = await db.collection("courses").findOne({ id: courseId }, {});

		if (!course) {
			return NextResponse.json({ error: "Course not found." }, { status: 404 });
		}

		return NextResponse.json(course, { status: 200 });
	} catch (error) {
		console.error("Error retrieving course:", error);
		return NextResponse.json(
			{ error: "Failed to retrieve course." },
			{ status: 500 }
		);
	}
}

// PUT: Update a course by ID
export async function PUT(
	request: Request,
	context: { params: Promise<{ id: string }> } // Await params
) {
	try {
		const { id } = await context.params; // Await params before accessing
		const courseId = parseInt(id, 10);
		if (isNaN(courseId)) {
			return NextResponse.json(
				{ error: "Invalid course ID." },
				{ status: 400 }
			);
		}

		const updatedCourse: Partial<Course> = await request.json();

		const client = await clientPromise;
		const db = client.db("coursesDb");
		const courses = await db
			.collection("courses")
			.findOneAndUpdate(
				{ id: courseId },
				{
					$set: {
						title: updatedCourse.title,
						description: updatedCourse.description,
						estimatedTime: updatedCourse.estimatedTime,
					},
				}
			);

		if (!courses) {
			return NextResponse.json({ error: "Course not found." }, { status: 404 });
		}

		return NextResponse.json(courses, { status: 200 });
	} catch (error) {
		console.error("Error updating course:", error);
		return NextResponse.json(
			{ error: "Failed to update course." },
			{ status: 500 }
		);
	}
}

// DELETE: Remove a course by ID
export async function DELETE(
	request: Request,
	context: { params: Promise<{ id: string }> } // Await params
) {
	try {
		const client = await clientPromise;
		const db = client.db("coursesDb");
		const courses = await db.collection("courses").deleteOne();

		const { id } = await context.params; // Await params before accessing
		const courseId = parseInt(id, 10);
		if (isNaN(courseId)) {
			return NextResponse.json(
				{ error: "Invalid course ID." },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ message: `Course with ID ${courseId} deleted.` },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting course:", error);
		return NextResponse.json(
			{ error: "Failed to delete course." },
			{ status: 500 }
		);
	}
}
