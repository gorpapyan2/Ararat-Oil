import { TodoList } from "@/components/todo";
import { PageLayout } from "@/layouts/PageLayout";
import { ListTodo } from "lucide-react";
import { useTranslation } from "react-i18next";

const TodoPage = () => {
  const { t } = useTranslation();

  return (
    <PageLayout
      titleKey="todo.title"
      descriptionKey="todo.description"
      icon={ListTodo}
    >
      <TodoList />
    </PageLayout>
  );
};

export default TodoPage;
