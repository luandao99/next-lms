import { IconBadge } from "@/components/ui/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";


const CourseIdPage = async({params}:{
    params:{courseId:string}
}) => {
    const {userId} = auth();

    if(!userId){
        return redirect("/");
    }
    const course = await db.course.findUnique({
        where:{
            id: params.courseId
        }
    })

    if(!course)
    {
        return redirect("/");
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ];


    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    //const completedFields = requiredFields.filter(Boolean).length;: 
    //Đoạn này sử dụng filter(Boolean) để loại bỏ những giá trị falsy 
    //(ví dụ: null, undefined, false, hoặc chuỗi rỗng) khỏi mảng requiredFields, 
    //sau đó tính toán độ dài của mảng sau khi đã loại bỏ giá trị falsy. 
    //Điều này sẽ cho biết có bao nhiêu trường đã được điền.

    const completionText = `(${completedFields} / ${totalFields})`

    return ( <div className="p-6">
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                Course setup
                </h1>
               <span>
               Complete all fields {completionText}
               </span>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
                <div className="flex items-center gap-x-2">
                    <IconBadge size="sm" variant="success" icon={LayoutDashboard} />
                <h2 className="text-2xl">
                    Customize your course
                </h2>
                </div>
                <TitleForm
                initialData ={course}
                courseId= {course.id}
                />

                
            </div>

        </div>
        
    </div> );
}
 
export default CourseIdPage;