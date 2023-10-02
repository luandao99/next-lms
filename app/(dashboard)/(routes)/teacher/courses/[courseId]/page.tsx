import { IconBadge } from "@/components/ui/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
  CircleDollarSign,
  LayoutDashboard,
  ListChecks,
  File,
} from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttchmentForm } from "./_components/attchment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Banner } from "@/components/bannder";
import { Actions } from "./_components/actions";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters:{
        orderBy:{
          position:"asc"
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  console.log(categories);

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter=>chapter.isPublished)
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  //const completedFields = requiredFields.filter(Boolean).length;:
  //Đoạn này sử dụng filter(Boolean) để loại bỏ những giá trị falsy
  //(ví dụ: null, undefined, false, hoặc chuỗi rỗng) khỏi mảng requiredFields,
  //sau đó tính toán độ dài của mảng sau khi đã loại bỏ giá trị falsy.
  //Điều này sẽ cho biết có bao nhiêu trường đã được điền.

  const completionText = `(${completedFields} / ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
    {!course.isPublished &&(
      <Banner
          variant="warning"
          label="This couser is unpublicshed. It will not be visible in the course"
       />
    )}
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span>Complete all fields {completionText}</span>
        </div>
        <Actions
        disabled={!isComplete}
        courseId={params.courseId}
        isPublished={course.isPublished}
         />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge size="sm" variant="success" icon={LayoutDashboard} />
            <h2 className="text-2xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course chapters</h2>
            </div>
            <ChaptersForm initialData={course} courseId={course.id} />
          </div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={CircleDollarSign} />
            <h2 className="text-xl">Sell your course</h2>
          </div>
          <PriceForm initialData={course} courseId={course.id} />

          <div className="flex items-center gap-x-2">
            <IconBadge icon={File} />
            <h2 className="text-xl">Resource & Attachments</h2>
          </div>

          <AttchmentForm initialData={course} courseId={course.id} />
        </div>
      </div>
    </div>
    </>
    
  );
};

export default CourseIdPage;
