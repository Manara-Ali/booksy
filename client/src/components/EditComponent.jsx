import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ModalContext } from "../context/ModalContext";
import {
  updateBook,
  enteredTitle,
  enteredGenre,
  enteredAuthor,
  enteredNumPages,
  enteredNumChapters,
  enteredSynopsis,
  enteredExplaination,
  enteredThoughts,
  enteredRating,
  // enteredRecommendation,
} from "../store";

const EditComponent = () => {
  const navigate = useNavigate();

  const { book } = useSelector((state) => {
    return state.booksCombinedReducer;
  });

  const {
    title,
    genre,
    author,
    numberOfPages,
    numberOfChapters,
    synopsis,
    myExplanation,
    finalThoughts,
    ratingsAverage,
    // recommendation,
  } = useSelector((state) => {
    return state.formCombinedReducer;
  });

  const dispatch = useDispatch();

  const { setModalOpen } = useContext(ModalContext);

  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [debouncedGenre, setDebouncedGenre] = useState("");
  const [debouncedAuthor, setDebouncedAuthor] = useState("");
  const [debouncedNumPages, setDebouncedNumPages] = useState(0);
  const [debouncedNumChapters, setDebouncedNumChapters] = useState(0);
  const [debouncedSynopsis, setDebouncedSynopsis] = useState("");
  const [debouncedExplanation, setDebouncedExplanation] = useState("");
  const [debouncedToughts, setDebouncedToughts] = useState("");
  const [debouncedRating, setDebouncedRating] = useState(0);

  const handleTitleChange = (term) => {
    return dispatch(enteredTitle(term));
  };

  const handleGenreChange = (value) => {
    return dispatch(enteredGenre(value));
  };

  const handleAuthorChange = (value) => {
    return dispatch(enteredAuthor(value));
  };

  const handleNumPagesChange = (value) => {
    return dispatch(enteredNumPages(Number(value)));
  };

  const handleNumChaptersChange = (value) => {
    return dispatch(enteredNumChapters(Number(value)));
  };

  const hanldeSynopsisChange = (value) => {
    return dispatch(enteredSynopsis(value));
  };

  const handleExplainationChange = (value) => {
    return dispatch(enteredExplaination(value));
  };

  const handleThoughtsChange = (value) => {
    return dispatch(enteredThoughts(value));
  };

  const handleRatingChange = (value) => {
    return dispatch(enteredRating(Number(value)));
  };

  //   const handleRecommendationChange = (e) => {
  //     const value = e.target.value === "Yes" ? true : false;
  //     return dispatch(enteredRecommendation(value));
  //   };

  const handleFormSubmission = (e, book, obj) => {
    e.preventDefault();

    for (let key of Object.keys(book)) {
      if (!obj[key]) {
        obj[key] = book[key];
      }
    }

    console.log(obj);
    dispatch(updateBook(obj));

    // Navigate back to the homepage if a value inside the two objects has changed
    for (const key of Object.keys(book)) {
      if (!Object.is(book[key], obj[key])) {
        setModalOpen(false);
        document.querySelector("#main-container").classList.remove("blur");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleTitleChange(debouncedTitle);
    }, 500);

    return () => {
      return clearTimeout(timerId);
    };
  }, [debouncedTitle]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleGenreChange(debouncedGenre);
    }, 500);

    return () => {
      return clearTimeout(timerId);
    };
  }, [debouncedGenre]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleAuthorChange(debouncedAuthor);
    }, 500);

    return () => {
      return clearTimeout(timerId);
    };
  }, [debouncedAuthor]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleNumPagesChange(debouncedNumPages);
    }, 500);

    return () => {
      return clearTimeout(timerId);
    };
  }, [debouncedNumPages]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleNumChaptersChange(debouncedNumChapters);

      return () => {
        return clearTimeout(timerId);
      };
    }, 500);
  }, [debouncedNumChapters]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      hanldeSynopsisChange(debouncedSynopsis);
    }, 500);

    return () => {
      return clearTimeout(timerId);
    };
  }, [debouncedSynopsis]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleExplainationChange(debouncedExplanation);
    }, 500);

    return () => {
      return clearTimeout(timerId);
    };
  }, [debouncedExplanation]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleThoughtsChange(debouncedToughts);
    }, 500);

    return () => {
      return clearTimeout(timerId);
    };
  }, [debouncedToughts]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleRatingChange(debouncedRating);
    }, 500);

    return () => {
      return clearTimeout(timerId);
    };
  }, [debouncedRating]);

  return (
    <div className="modal-message">
      <>
        <Form
          className="add-book-form"
          onSubmit={(e) => {
            return handleFormSubmission(e, book, {
              title,
              genre,
              author,
              numberOfPages,
              numberOfChapters,
              synopsis,
              myExplanation,
              finalThoughts,
              ratingsAverage,
            });
          }}
        >
          <h1>Edit Book</h1>
          {/* <p>Use this form to share a book</p> */}
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder={book.title}
              onChange={(e) => {
                return setDebouncedTitle(e.target.value);
              }}
              value={debouncedTitle}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicGenre">
            <Form.Label>Genre</Form.Label>
            <Form.Control
              type="text"
              placeholder={book.genre}
              onChange={(e) => {
                return setDebouncedGenre(e.target.value);
              }}
              value={debouncedGenre}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicAuthor">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              placeholder={book.author}
              className="input-box"
              onChange={(e) => {
                return setDebouncedAuthor(e.target.value);
              }}
              value={debouncedAuthor}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPages">
            <Form.Label>Number of Pages</Form.Label>
            <Form.Control
              type="number"
              placeholder={`${book.numberOfPages} Pages`}
              className="input-box"
              onChange={(e) => {
                return setDebouncedNumPages(e.target.value);
              }}
              value={debouncedNumPages || ""}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicChapters">
            <Form.Label>Number of Chapters</Form.Label>
            <Form.Control
              type="number"
              placeholder={`${book.numberOfChapters} Chapters`}
              className="input-box"
              onChange={(e) => {
                setDebouncedNumChapters(e.target.value);
              }}
              value={debouncedNumChapters || ""}
            />
          </Form.Group>

          <Form.Group controlId="cover-image" className="my-3">
            <Form.Label>Book Cover Image</Form.Label>
            <div className="book-cover-img">
              <img id="book-cover-img" alt="book cover" />
              <Form.Control
                className="book-img-input"
                name="coverImage"
                type="file"
                accept="image/*"
              ></Form.Control>
            </div>
          </Form.Group>

          <Form.Group controlId="images-1" className="my-3">
            <Form.Label>Additional Book Images</Form.Label>
            <div className="book-cover-img">
              <img id="book-cover-img" alt="user provided cover-1" />
              <Form.Control
                className="book-img-input"
                name="images"
                type="file"
                accept="image/*"
              ></Form.Control>
            </div>
          </Form.Group>

          <Form.Group controlId="images-2" className="my-3">
            <Form.Label>Additional Book Images</Form.Label>
            <div className="book-cover-img">
              <img id="book-cover-img" alt="user provided cover-1" />
              <Form.Control
                className="book-img-input"
                name="images"
                type="file"
                accept="image/*"
              ></Form.Control>
            </div>
          </Form.Group>

          <Form.Group controlId="images-3" className="my-3">
            <Form.Label>Additional Book Images</Form.Label>
            <div className="book-cover-img">
              <img id="book-cover-img" alt="user provided cover-1" />
              <Form.Control
                className="book-img-input"
                name="images"
                type="file"
                accept="image/*"
              ></Form.Control>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicSynopsis">
            <Form.Label>Synopsis</Form.Label>
            <Form.Control
              as="textarea"
              name="synopsis"
              rows="3"
              columns="10"
              type="text"
              placeholder={`${book.synopsis}`}
              className="input-box"
              onChange={(e) => {
                return setDebouncedSynopsis(e.target.value);
              }}
              value={debouncedSynopsis}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicExplanation">
            <Form.Label>My Explanation</Form.Label>
            <Form.Control
              as="textarea"
              name="explaination"
              rows="3"
              columns="10"
              type="text"
              placeholder={`${book.myExplanation}`}
              className="input-box"
              onChange={(e) => {
                return setDebouncedExplanation(e.target.value);
              }}
              value={debouncedExplanation}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicThoughts">
            <Form.Label>Final Thoughts</Form.Label>
            <Form.Control
              as="textarea"
              name="final-thoughts"
              rows="3"
              columns="10"
              type="text"
              placeholder={`${book.finalThoughts}`}
              className="input-box"
              onChange={(e) => {
                return setDebouncedToughts(e.target.value);
              }}
              value={debouncedToughts}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicRating">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              placeholder={`${book.ratingsAverage} out of 5 stars`}
              className="input-box"
              onChange={(e) => {
                return setDebouncedRating(e.target.value);
              }}
              value={debouncedRating || ""}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicRecommendation">
            <Form.Label>Would you recommend this book?</Form.Label>
            <Form.Control as="select">
              <option>Yes</option>
              <option>No</option>
            </Form.Control>
          </Form.Group>
          <div className="button-div">
            <Button className="card-btn update" type="submit">
              Update
            </Button>
            <Button
              className="card-btn cancel"
              //   type="submit"
              onClick={() => {
                setModalOpen(false);
                document
                  .querySelector("#main-container")
                  .classList.remove("blur");
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </>
    </div>
  );
};

export default EditComponent;
