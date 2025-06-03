import { renderHook, act } from "@testing-library/react-hooks";
import { useZodForm } from "./useZodForm";
import { z } from "zod";

describe("useZodForm", () => {
  const testSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    age: z.number().min(18, "Must be at least 18 years old"),
  });

  type TestFormValues = z.infer<typeof testSchema>;

  const defaultValues: TestFormValues = {
    name: "",
    email: "",
    age: 0,
  };

  it("should initialize with default values", () => {
    const { result } = renderHook(() =>
      useZodForm({
        schema: testSchema,
        defaultValues,
      })
    );

    expect(result.current.getValues()).toEqual(defaultValues);
  });

  it("should validate against schema", async () => {
    const { result } = renderHook(() =>
      useZodForm({
        schema: testSchema,
        defaultValues,
      })
    );

    // Set invalid values
    act(() => {
      result.current.setValue("name", "a");
      result.current.setValue("email", "invalid-email");
      result.current.setValue("age", 16);
    });

    // Trigger validation
    let isValid = false;
    await act(async () => {
      isValid = await result.current.trigger();
    });

    expect(isValid).toBe(false);

    // Check error messages
    expect(result.current.formState.errors.name?.message).toBe(
      "Name must be at least 2 characters"
    );
    expect(result.current.formState.errors.email?.message).toBe(
      "Invalid email format"
    );
    expect(result.current.formState.errors.age?.message).toBe(
      "Must be at least 18 years old"
    );

    // Set valid values
    act(() => {
      result.current.setValue("name", "John Doe");
      result.current.setValue("email", "john@example.com");
      result.current.setValue("age", 25);
    });

    // Trigger validation again
    await act(async () => {
      isValid = await result.current.trigger();
    });

    expect(isValid).toBe(true);
    expect(result.current.formState.errors).toEqual({});
  });

  it("should handle form submission", async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useZodForm({
        schema: testSchema,
        defaultValues,
      })
    );

    // Set valid values
    act(() => {
      result.current.setValue("name", "John Doe");
      result.current.setValue("email", "john@example.com");
      result.current.setValue("age", 25);
    });

    // Submit the form
    await act(async () => {
      await result.current.handleSubmit(onSubmit)();
    });

    expect(onSubmit).toHaveBeenCalledWith(
      {
        name: "John Doe",
        email: "john@example.com",
        age: 25,
      },
      expect.anything()
    );
  });

  it("should not submit with invalid data", async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useZodForm({
        schema: testSchema,
        defaultValues,
      })
    );

    // Set invalid values
    act(() => {
      result.current.setValue("name", "a");
      result.current.setValue("email", "invalid-email");
      result.current.setValue("age", 16);
    });

    // Try to submit the form
    await act(async () => {
      await result.current.handleSubmit(onSubmit)();
    });

    // onSubmit should not be called with invalid data
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
