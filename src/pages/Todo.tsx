import TodoList from "../components/Todo";
import { useTranslation } from "react-i18next";

const TodoPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("todo.title")}</h1>
      <TodoList />
    </div>
  );
};

export default TodoPage; 