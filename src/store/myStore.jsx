import axios from "axios";
import { createContext, useEffect, useReducer, useState } from "react";

export const ExamContext = createContext({
  checkProceed: false,
  setCheckProceed: () => { },
  Questions: [],
  ExamTime: {},
  SaveResponse: () => { },
  ClearResponse: () => { },
  response: [],
  ExamTitle: {},
  User: {},
  setExamId: () => { },
  setToken: () => { },
});

const responseReducer = (response, action) => {
  let newResponse;

  if (action.type == "SAVE_RESPONSE") {
    newResponse = [
      ...(response.answers || []).filter(
        (ans) => ans.questionId !== action.payload.questionId
      ),
      {
        questionId: action.payload.questionId,
        selectedOption: action.payload.selectedOption,
      },
    ];
  } else if (action.type == "CLEAR_RESPONSE") {
    newResponse = (response.answers || []).filter(
      (ans) => ans.questionId !== action.payload.questionId
    );
  }
  let updatedResponse = {
    ...response,
    examId: action.payload.examId || response.examId,
    answers: newResponse,
  };

  localStorage.setItem("response", JSON.stringify(updatedResponse));
  return updatedResponse;
};

const ExamProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});
  const [exam, setExam] = useState(localStorage.getItem('exam') ? JSON.parse(localStorage.getItem('exam')) : {});
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
  const [examId, setExamId] = useState(localStorage.getItem('examId') ? localStorage.getItem('examId') : "");

  const [checkProceed, setCheckProceed] = useState(false);
  const [response, dispatch] = useReducer(
    responseReducer,
    localStorage.getItem("response")
      ? JSON.parse(localStorage.getItem("response"))
      : { examId: "", answers: [] }
  );

  const Questions = (exam?.questions || []).map((question) => ({
    id: question._id || question.id || "",
    content: question.text || question.content || "",
    url: question.image || "",
    options: (question.options || []).map((option) => ({
      id: option._id || option.id || "",
      value: option.text || option.value || ""
    }))
  }));

  const ExamTime = {
    start: exam?.startTime || null,
    end: exam?.endTime || null,
  };

  const ExamTitle = {
    title: exam?.title || "",
  };

  const fetchUser = async (token) => {
    const res = await axios.post("http://localhost:8000/api/profile", {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res) {
      console.log(res.data);
      setUser(res.data.data);

    }
  };

  const fetchExamDetails = async (examId, token) => {
    const res = await axios.post(`http://localhost:8000/api/exam-taking/start/${examId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res) {
      setExam(res.data.data.exam)
    }
  }

  useEffect(() => {
    if (token) {
      fetchUser(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    }

  }, [token, user]);

  useEffect(() => {
    if (examId && token) {
      fetchExamDetails(examId, token)
      localStorage.setItem('examId', examId);
      localStorage.setItem('exam', JSON.stringify(exam));
    }

  }, [token, exam, examId]);

  const SaveResponse = ({ questionId, selectedOption, examId }) => {
    try {
      dispatch({
        type: "SAVE_RESPONSE",
        payload: {
          questionId,
          selectedOption,
          examId,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  const ClearResponse = ({ questionId, examId }) => {
    try {
      dispatch({
        type: "CLEAR_RESPONSE",
        payload: {
          questionId,
          examId,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ExamContext.Provider
      value={{
        response,
        ClearResponse,
        SaveResponse,
        ExamTime,
        Questions,
        checkProceed,
        setCheckProceed,
        User: user,
        token,
        setToken,
        setExamId,
        examId,
        ExamTitle
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export default ExamProvider;
