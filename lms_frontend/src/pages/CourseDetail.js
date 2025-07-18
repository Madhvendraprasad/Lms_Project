import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [quizIndex, setQuizIndex] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [progress, setProgress] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/courses/${id}`).then((res) => {
      setCourse(res.data);
    });

    if (token) {
      axios
        .get(`${process.env.REACT_APP_API}/progress/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCompleted(res.data?.completedLessons || []);
          setProgress(res.data);
        })
        .catch(() => {
          setCompleted([]);
        });
    }
  }, [id, token]);

  const enroll = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/courses/${id}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Enrolled successfully!");
    } catch (err) {
      alert("Enrollment failed.");
    }
  };

  const markCompleted = async (lessonIndex) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/progress/lesson`,
        {
          courseId: id,
          lessonIndex,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompleted((prev) => [...prev, lessonIndex]);
    } catch (err) {
      alert("Failed to mark lesson as complete.");
    }
  };

  const handleOptionSelect = (qIndex, optIndex) => {
    setUserAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const submitQuiz = async () => {
    const quiz = course.quizzes[quizIndex];
    let score = 0;

    quiz.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) score++;
    });

    try {
      await axios.post(
        `${process.env.REACT_APP_API}/progress/quiz`,
        {
          courseId: id,
          quizIndex,
          score,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`Quiz submitted! Your score: ${score}/${quiz.questions.length}`);
    } catch {
      alert("Failed to submit quiz.");
    }

    setQuizIndex(null);
    setUserAnswers({});

    // Refresh progress after submitting quiz
    axios
      .get(`${process.env.REACT_APP_API}/progress/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProgress(res.data);
        setCompleted(res.data?.completedLessons || []);
      });
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>
        <strong>Instructor:</strong> {course.instructor}
      </p>
      <p>
        <strong>Price:</strong> ₹{course.price}
      </p>

      <button onClick={enroll}>Enroll</button>

      <h3>Lessons</h3>
      <ul>
        {course.lessons.map((lesson, index) => (
          <li key={index}>
            {lesson.title}{" "}
            {!completed.includes(index) ? (
              <button onClick={() => markCompleted(index)}>
                ✅ Mark as Completed
              </button>
            ) : (
              <span style={{ color: "green" }}>✔️ Completed</span>
            )}
          </li>
        ))}
      </ul>

      <h3>Quizzes</h3>
      <ul>
        {course.quizzes.map((quiz, index) => (
          <li key={index}>
            {quiz.title}{" "}
            <button onClick={() => setQuizIndex(index)}>Attempt</button>
          </li>
        ))}
      </ul>

      {quizIndex !== null && (
        <div>
          <h4>{course.quizzes[quizIndex].title} (Attempting)</h4>
          {course.quizzes[quizIndex].questions.map((q, qIdx) => (
            <div key={qIdx}>
              <p>
                <strong>
                  {qIdx + 1}. {q.text}
                </strong>
              </p>
              {q.options.map((opt, optIdx) => (
                <label key={optIdx}>
                  <input
                    type="radio"
                    name={`question-${qIdx}`}
                    checked={userAnswers[qIdx] === optIdx}
                    onChange={() => handleOptionSelect(qIdx, optIdx)}
                  />
                  {opt}
                  <br />
                </label>
              ))}
            </div>
          ))}
          <button onClick={submitQuiz}>Submit Quiz</button>
        </div>
      )}

      {progress && (
        <div>
          <h3>📊 Progress Overview</h3>
          <p>
            Lessons Completed: {completed.length} / {course.lessons.length} (
            {Math.round((completed.length / course.lessons.length) * 100)}%)
          </p>

          {progress.quizAttempts.length > 0 && (
            <div>
              <h4>Past Quiz Attempts:</h4>
              <ul>
                {progress.quizAttempts.map((attempt, i) => (
                  <li key={i}>
                    Quiz #{attempt.quizIndex + 1} — Score: {attempt.score} —{" "}
                    {new Date(attempt.date).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
