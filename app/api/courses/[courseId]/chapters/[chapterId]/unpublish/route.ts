import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCourser = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!ownCourser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unPublishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      },
    });
    

    const publishedChaptersInCourse = await db.chapter.findMany({
      where:{
        courseId: params.courseId,
        isPublished: true
      }
    })
    if(!publishedChaptersInCourse.length)
    {
      await db.course.update({
        where:{
          id: params.courseId
        }, 
        data:{
          isPublished:false
        }
      })
    }
    return NextResponse.json(unPublishedChapter);
  } catch (error) {
    console.log("[COURSES_PUBLISH", error);

    return new NextResponse("Internal server error", { status: 501 });
  }
}
