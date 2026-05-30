import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import css from "./SearchBar.module.css";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

interface SearchFormValues {
  query: string;
}

const initialValues: SearchFormValues = {
  query: "",
};

export default function SearchBar({ onSubmit }: SearchBarProps) {
  return (
    <header className={css["header"]}>
      <div className={css["container"]}>
        <a
          className={css["link"]}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            const clearQuery = values.query.trim();

            actions.resetForm();

            if (!clearQuery) {
              toast.error("Please enter your search query.");
              return;
            }

            onSubmit(clearQuery);
          }}
        >
          <Form className={css["form"]}>
            <Field
              className={css["input"]}
              type="text"
              name="query"
              autoComplete="off"
              placeholder="Search movies..."
              autoFocus
            />

            <button className={css["button"]} type="submit">
              Search
            </button>
          </Form>
        </Formik>
      </div>
    </header>
  );
}