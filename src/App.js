import React, { useState, useEffect } from 'react';
import questionsData from './quizQuestions.json';
import quizData from './quizTopics.json'
import { Form } from 'react-bootstrap';

const App = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [subtopics, setSubtopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setTopics(quizData);
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      const topic = quizData.find(t => t.topic === selectedTopic);
      setSubtopics(topic ? topic.subtopics : []);
    }
  }, [selectedTopic]);

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    setSelectedSubtopic('');
    setQuestions([]);
    setSubmitted(false);
    setScore(0);
  };

  const handleSubtopicChange = (e) => {
    setSelectedSubtopic(e.target.value);
    fetchQuestions(selectedTopic, e.target.value);
  };

  const fetchQuestions = (topic, subtopic) => {
    const topicData = questionsData[topic];
    const subtopicData = topicData ? topicData[subtopic] : [];
    setQuestions(subtopicData);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    let newScore = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div class="card p-2 bg-secondary-subtle">
      <div class="card-header text-bg-primary"><h2>AI Quiz Coach</h2></div>
      <div class="card-body">
        <div class="card-header bg-primary text-white bg-opacity-50">
          <h4>Topic Selection</h4>
        </div>

        <div class="bg-info-subtle">
          <div class="col-md-3 p-2">
            <label >Select Topic:</label>
            <select class="form-select bg-primary bg-opacity-75 text-white" value={selectedTopic} onChange={handleTopicChange}>
              <option value="">--Select Topic--</option>
              {topics.map((topic, index) => (
                <option key={index} value={topic.topic}>{topic.topic}</option>
              ))}
            </select>
          </div>
          <div class="col-md-3 p-2">
            {subtopics.length > 0 && (
              <div>
                <label>Select Subtopic: </label>
                <select class="form-select bg-primary bg-opacity-75 text-white" value={selectedSubtopic} onChange={handleSubtopicChange}>
                  <option value="">--Select Subtopic--</option>
                  {subtopics.map((subtopic, index) => (
                    <option key={index} value={subtopic}>{subtopic}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {questions.length > 0 && (
        <div class="card-body">
          <Form onSubmit={handleSubmit}>
            <div class="card-header bg-primary text-white bg-opacity-50">
              <h4>Questions</h4>
            </div>
            <ul class="list-group list-group-flush">
              {questions.map((question, qIndex) => (
                <li key={'Q' + qIndex} class="list-group-item bg-info-subtle">
                  <div>
                    <div class="card-header">
                      <p>{qIndex + 1}. {question.question}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                      {question.options.map((option, oIndex) => (
                        <li key={'Q' + qIndex + oIndex} class="list-group-item bg-primary-subtle">
                          <div>
                            <input
                              type="radio"
                              name={`question-${qIndex}`}
                              value={oIndex}
                              checked={answers[qIndex] === oIndex}
                              onChange={() => handleAnswerChange(qIndex, oIndex)}
                              disabled={submitted}
                              class="form-check-input"
                              required
                            />
                            <label class="form-check-label">{option}</label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}

              <div class="list-group-item bg-info-subtle">
                {!submitted && (
                  <button type='submit' class="btn btn-success">Submit</button>
                )}
                {!submitted && (
                  <button type="button" class="btn btn-danger" onClick={handleReset}>Reset</button>
                )}
              </div>
            </ul>
          </Form>
        </div>
      )}

      {submitted && (
        <div class="card-body">
          <div class="card-header bg-primary text-white bg-opacity-50">
            <h4>Results</h4>
          </div>
          <ul class="list-group list-group-flush">
            {questions.map((question, qIndex) => (
              <li key={'R' + qIndex} class="list-group-item bg-info-subtle">
                <div key={qIndex}>
                  <div class="card-header">
                    <p>{qIndex + 1}. {question.question}</p>
                  </div>
                  <ul class="list-group list-group-flush">
                    {question.options.map((option, oIndex) => (
                      <li key={'R' + qIndex + oIndex} class="list-group-item bg-primary-subtle">
                        <div style={{ color: question.answer === oIndex ? 'green' : answers[qIndex] === oIndex ? 'red' : 'black' }}>
                          {option}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          <div class="card-header bg-primary text-white bg-opacity-50">
            <h4>Your Score: {score} / {questions.length}</h4>
          </div>
        </div>
      )}


    </div>
  );
};

export default App;
