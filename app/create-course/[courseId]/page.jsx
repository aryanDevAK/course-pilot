"use client";
import { db } from "@/configs/db";
import { CourseList, Chapters } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import { Button } from "@/components/ui/button";
import { GenerateChapterContent_AI } from "@/configs/AiModel";
import LoadingDialog from "../_components/LoadingDialog";
import getVideos from "@/configs/service";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function CourseLayout({ params }) {
  const Params = React.use(params);
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    // console.log(Params); //courseId
    // console.log(user);

    if (Params && user) {
      GetCourse();
    }
  }, [Params, user]);

  const GetCourse = async () => {
    try {
      const params = await Params;
      const result = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, params?.courseId),
            eq(CourseList?.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      setCourse(result[0]);
      // console.log("Course data:", result[0]);
    } catch (error) {
      // console.error("Error fetching course:", error);
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  const GenerateChapterContent = async () => {
    setLoading(true);

    try {
      const chapters = course?.courseOutput?.Chapters;

      const includeVideo = course?.includeVideo;
      // console.log("IncludeVideo : " + includeVideo);

      // Delete previous content if generated and got any error
      const checkPreviousContent = await db
        .select()
        .from(Chapters)
        .where(eq(Chapters.courseId, course?.courseId));
      if (checkPreviousContent.length > 0) {
        const chapterResponse = await db
          .delete(Chapters)
          .where(eq(Chapters.courseId, course?.courseId))
          .returning({ id: Chapters?.id });
      }

      for (const [index, chapter] of chapters.entries()) {
        // console.log(`Generating Chapter Content for ${chapter?.ChapterName}`);

        const PROMPT = `
        Generate detailed content for the following topic in strict JSON format:
        - Topic: ${course?.name}
        - Chapter: ${chapter?.ChapterName}

        The response must be a valid JSON object containing an array of objects with the following fields:
        1. "title": A short and descriptive title for the subtopic.
        2. "explanation": A detailed and easy to understand explanation of the subtopic in minimum 150 words and maximum 1000 words.
        3. "codeExample": A code example (if applicable) wrapped in <precode> tags in the programming language in which the chapter is being written (if applicable) otherwise use only 1 programming language all over the course that suites best, or an empty string if no code example is available. If the course is about a non-programming topic, you can provide an example in a different format (e.g., a formula, a diagram, a question bank for mathematics etc.).

        Ensure:
        - The JSON is valid and follows the specified format.
        - The JSON is properly formatted with no syntax errors.
        - The JSON contains the required fields.
        - The JSON contains the correct data types.
        - Proper escaping of special characters.
        - No trailing commas or malformed syntax.
        - The JSON is properly nested and structured.
        - The response can be parsed directly using JSON.parse().

        Example format:
        {
          "title": "Topic Title",
          "chapters": [
            {
              "title": "Subtopic Title",
              "explanation": "Detailed explanation here.",
              "codeExample": "<precode>Code example here</precode>"
            }
          ]
        }
      `;

        // const PROMPT = `Generate detailed notes for the following topic in strict JSON format:  
        // - Topic: "${course?.name}"  
        // - Chapter: "${chapter?.ChapterName}"  
        // - Duration: "${chapter?.Duration}"

        // The response must be a valid JSON object containing an array of objects with the following fields:  

        // 1. "title": A short and descriptive title for the subtopic.  
        // 2. "explanation": A detailed and easy-to-understand explanation of the subtopic (minimum 150 words, maximum 1000 words). Write in points. Necessary to include examples atleast 5 and maximum 10.
        // 3. "codeExample":  
        //   - A code example (if applicable) wrapped in precode tags in the programming language relevant to the chapter.  
        //   - If no specific programming language is mentioned, use a single consistent language throughout the course.   
        //   -Provide examples minimum 5 and maximum 10. Also generate practice questions minimum 10 and maximum 20.
        //   - If no example is applicable, return an empty string.  
        //   -You should return bulleted lists wherever applicable.

        // Ensure the following: 
        // - The JSON output is valid and follows the specified format. 
        // -The JSON is properly formattedwith new line characters for readability and easy parsing. 
        // - The JSON is properly formatted with no syntax errors.  
        // - All required fields are present with correct data types.  
        // - Special characters are properly escaped.  
        // - The JSON has no trailing commas or malformed syntax.  
        // - The JSON is properly nested and structured.  
        // - The response can be directly parsed using JSON.parse().  

        // Example Format:   
        // {  
        //   "title": "Topic Title",  
        //   "chapters": [  
        //     {  
        //       "title": "Subtopic Title",  
        //       "explanation": "Detailed explanation here.",  
        //       "codeExample": "<precode>Code example here</precode>"  
        //     }  
        //   ]  
        // }  
        // `
        const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
        // console.log(result?.response?.text());
        const content = JSON.parse(result?.response?.text());

        // Generate Video URL

        let videoId = null;

        if (includeVideo === "Yes") {
          // console.log(`Generating Video URL for ${chapter?.ChapterName}`);
          const resp = await getVideos(
            course?.name + ":" + chapter?.ChapterName
          );

          // console.log(resp);

          // console.log(resp[0]?.id?.videoId);
          videoId = [
            resp[0]?.id?.videoId,
            resp[1]?.id?.videoId,
            resp[2]?.id?.videoId,
          ];
          // console.log(videoId);
        }
        // Save Chapter Content + Video URL

        await db.insert(Chapters).values({
          chapterId: index,
          courseId: course?.courseId,
          content: content,
          videoId: videoId,
        });
        toast({
          duration: 2000,
          title: `Congratulations!`,
          description: `Chapter ${index + 1} has been crafted successfully!`,
        });
      }
      await db
        .update(CourseList)
        .set({
          publish: true,
        })
        .where(eq(CourseList.courseId, course?.courseId));

      toast({
        variant: "success",
        duration: 3000,
        title: "Congratulations!",
        description: "Course Pilot crafted your personalized course content!",
      });
      router.replace("/create-course/" + course?.courseId + "/finish");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        duration: 5000,
        title: "Uh oh! Something went wrong.",
        description: error?.message || "An unexpected error occurred!",
      });
      await GetCourse();
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <LoadingDialog loading={loading} />
      <div className="mt-10 px-7 md:px-20 lg:px-44">
        <h2 className="font-bold text-center text-2xl">Course Layout</h2>
        {/* Basic Info */}
        <CourseBasicInfo course={course} refreshData={() => GetCourse()} />
        {/* Course Detail */}
        <CourseDetail course={course} />
        {/* List of Lesson */}
        <ChapterList course={course} refreshData={() => GetCourse()} />

        <Button onClick={() => GenerateChapterContent()} className="my-10">
          Generate Course Content
        </Button>
      </div>
    </>
  );
}

export default CourseLayout;
