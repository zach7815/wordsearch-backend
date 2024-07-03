export interface UserSubmission {
  authorName: string;
  header: string;
  title: string;
  difficulty: string;
  words: string[];
}

export interface Option {
  value: string;
  label: string;
}

export interface Field {
  onChange: (value: string) => void;
}

type HandleSaveFunction = (data: UserSubmission) => void;
export interface FormContainerProps {
  handleSave: HandleSaveFunction;
}

export interface WordSearchData {
  authorName: string;
  header: string;
  title: string;
  wordSearchData: string[][];
  answers: (string | null)[][];
  words: string[];
  level: string;
}
