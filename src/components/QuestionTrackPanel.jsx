import { useContext } from "react";
import { ExamContext } from "../store/myStore";
import "./trackPanel.css";

const QuestionTrackPanel = ({ setIdx }) => {
  const { Questions, response } = useContext(ExamContext);
  const goToQuestion = (idx) => {
    setIdx(idx);
  };

  const isQuestionAttempted = (id) => {
    return response.answers ? response.answers.some((ans) => ans.questionId === id) : false;
  };

  return (
    <div className="trackForm">
      <div className="trackHead">
        <span>Questions : {Questions.length}</span>
        <span>Attempted : {response.answers?.length || 0}</span>
      </div>
      <div className="trackNavigation">
        {Questions.map((q, i) => (
          <button
            key={`button-${q.id}`}
            onClick={() => goToQuestion(i + 1)}
            className={isQuestionAttempted(q.id) ? "attempted" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionTrackPanel;
