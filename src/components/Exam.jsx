import { useState } from "react";
import ExamHeadline from "./ExamHeadline";
import QuestionPanel from "./QuestionPanel";
import QuestionTrackPanel from "./QuestionTrackPanel";
import TopBar from "./TopBar";

const Exam = () => {
  const [index, setIndex] = useState(1);
  return (
    <>
      <TopBar />
      <ExamHeadline></ExamHeadline>
      <div className="examSection">
        <div className="questionSection">
          <QuestionPanel index={index} setIndex={setIndex}></QuestionPanel>
        </div>
        <div className="trackSection">
          <QuestionTrackPanel setIdx={setIndex}></QuestionTrackPanel>
        </div>
      </div>
    </>
  );
};

export default Exam;
