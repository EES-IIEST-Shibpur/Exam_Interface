import { useContext, useEffect, useState } from "react";
import { ExamContext } from "../store/myStore";
import "./question.css";

const QuestionPanel = ({ index, setIndex }) => {
  const { Questions, SaveResponse, ClearResponse, response, examId } = useContext(ExamContext);
  const currentQuestion = Questions[index - 1] || null;
  const prevResponse = currentQuestion
    ? response.answers?.filter((ans) => ans.questionId === currentQuestion.id) || []
    : [];
  const [option, setOption] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (prevResponse.length !== 0) {
      setOption(prevResponse[0].selectedOption);
    } else setOption(null);
  }, [index, currentQuestion]);

  const nextQuestion = () => {
    const len = Questions.length;
    if (index < len) {
      setIndex(index + 1);
      setOption(null);
    }
  };

  const prevQuestion = () => {
    if (index > 1) {
      setIndex(index - 1);
      setOption(null);
    }
  };

  const saveNext = () => {
    if (option) {
      const questionId = currentQuestion.id;
      const selectedOption = option;
      SaveResponse({ questionId, selectedOption, examId });
      setSaved(true);
      setTimeout(() => setSaved(false), 800);
    }
    const len = Questions.length;
    if (index < len) {
      setIndex(index + 1);
      setOption(null);
    }
  };

  const clear = () => {
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;
    ClearResponse({ questionId, examId });
    setOption(null);
  };

  const handleOption = (e) => {
    const val = e.target.value;
    setOption(val);
    if (currentQuestion) {
      SaveResponse({ questionId: currentQuestion.id, selectedOption: val, examId });
      setSaved(true);
      setTimeout(() => setSaved(false), 800);
    }
  };

  if (!currentQuestion) return <div className="questionPanel">Loading...</div>;

  return (
    <>
      <div className="questionPanel">
        <p>Question {index}.</p>
        <div className="content">{currentQuestion.content}</div>
        {currentQuestion.url && <img src={currentQuestion.url} alt="" />}

        <div className="options">
          {currentQuestion.options.map((op) => (
            <div key={op.id}>
              <input
                type="radio"
                value={op.id}
                name={`option-${index}`}
                id={op.id}
                checked={option === op.id}
                onChange={handleOption}
              />
              <label htmlFor={op.id}>{op.value}</label>
            </div>
          ))}
        </div>
        <div className="saveIndicator">{saved ? "Saved" : ""}</div>
      </div>

      <div className="panelButtons">
        <button onClick={prevQuestion}>Back</button>
        <button style={{ background: "#f55442" }} onClick={clear}>
          Clear
        </button>
        <button style={{ background: "#276e01" }} onClick={saveNext}>
          Save&Next
        </button>
        <button onClick={nextQuestion}>Next</button>
      </div>
    </>
  );
};

export default QuestionPanel;
