# QuizGen Creator

Quiz Builder is a powerful, flexible, and easy-to-use quiz creation tool. It allows you to create quizzes with various question types, including single select, multiple select, true-false, fill-in-the-blanks, and drag-and-drop. The user-friendly interface enables you to manage your quizzes effortlessly and efficiently.

## Features

- Support for multiple question types, including graded quizzes, fill-in-the-blanks, drag-and-drop, and personality quizzes
- Quiz data available in multiple languages (English and French)
- Interactive SVG components for hotspot questions
- Easily import and export quiz data
- Customizable quiz templates
- Responsive design with a clean user interface
- Create quizzes with various question types
- Add, update, and remove questions
- Randomize question order
- Calculate quiz score and set a passing grade
- Prevent changing answers after submission
- Allow language switching
- Display individual option feedback
- Provide end quiz button and feedback recap
- Export quiz data as JSON
- Import quiz data from JSON

## Installation

Clone this repository and install the necessary dependencies:

```
git clone https://github.com/csabourin/QuizGen-Creator/quizgen-creator.git
cd quizgen-creator
npm install
```

## Usage

Start the development server:

```
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

The main components and files of the project are:

- `src/main.js`: Entry point of the application
- `src/App.vue`: Main application component
- `src/components`: Components for creating and managing quizzes
  - `Question.vue`: Component for creating and editing questions
  - `QuestionPreview.vue`: Component for displaying question previews
  - `QuizManager.vue`: Component for managing quiz settings and data
  - `DragAndDrop.vue`: Component for drag-and-drop questions
  - `FillBlanks.vue`: Component for fill-in-the-blank questions
  - `GradedQuiz.vue`: Component for graded quizzes
  - `HotspotGenerator.vue`: Component for hotspot questions
  - `PersonalityQuiz.vue`: Component for personality quizzes
- `public`: Contains public assets, templates, and quiz data
  - `quizgen.css`: Main CSS file for the application
  - `QuizData_en.txt`: Quiz data in English
  - `QuizData_fr.txt`: Quiz data in French
  - `graded_quiz_template.html`: Graded quiz template
  - `personality_quiz_template.html`: Personality quiz template
  - `interactive-svg-*`: Interactive SVG components for hotspot questions

## Contributing

If you have any suggestions, improvements, or bug reports, feel free to submit a pull request or create an issue.

## License

QuizGen Creator is licensed under the MIT License.
