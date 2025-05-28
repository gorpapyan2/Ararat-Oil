import { renderHook, act } from "@testing-library/react-hooks";
import { useEntityDialog } from "./useEntityDialog";

describe("useEntityDialog", () => {
  interface TestEntity {
    id: number;
    name: string;
  }

  const testEntity: TestEntity = {
    id: 1,
    name: "Test Entity",
  };

  it("should initialize with correct state", () => {
    const { result } = renderHook(() => useEntityDialog<TestEntity>());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.entity).toBe(null);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isCreateMode).toBe(true);
    expect(result.current.isEditMode).toBe(false);
  });

  it("should open in create mode", () => {
    const { result } = renderHook(() => useEntityDialog<TestEntity>());

    act(() => {
      result.current.openCreate();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.entity).toBe(null);
    expect(result.current.isCreateMode).toBe(true);
    expect(result.current.isEditMode).toBe(false);
  });

  it("should open in edit mode", () => {
    const { result } = renderHook(() => useEntityDialog<TestEntity>());

    act(() => {
      result.current.openEdit(testEntity);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.entity).toEqual(testEntity);
    expect(result.current.isCreateMode).toBe(false);
    expect(result.current.isEditMode).toBe(true);
  });

  it("should handle create success", () => {
    const mockOnCreateSuccess = jest.fn();
    const mockOnSuccess = jest.fn();

    const { result } = renderHook(() =>
      useEntityDialog<TestEntity>({
        onCreateSuccess: mockOnCreateSuccess,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openCreate();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.handleCreateSuccess(testEntity);
    });

    expect(mockOnCreateSuccess).toHaveBeenCalledWith(testEntity);
    expect(mockOnSuccess).toHaveBeenCalledWith(testEntity);
    expect(result.current.isOpen).toBe(false);
  });

  it("should handle update success", () => {
    const mockOnUpdateSuccess = jest.fn();
    const mockOnSuccess = jest.fn();

    const { result } = renderHook(() =>
      useEntityDialog<TestEntity>({
        onUpdateSuccess: mockOnUpdateSuccess,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openEdit(testEntity);
    });

    expect(result.current.isOpen).toBe(true);

    const updatedEntity = { ...testEntity, name: "Updated Name" };

    act(() => {
      result.current.handleUpdateSuccess(updatedEntity);
    });

    expect(mockOnUpdateSuccess).toHaveBeenCalledWith(updatedEntity);
    expect(mockOnSuccess).toHaveBeenCalledWith(updatedEntity);
    expect(result.current.isOpen).toBe(false);
  });

  it("should handle delete success", () => {
    const mockOnDeleteSuccess = jest.fn();

    const { result } = renderHook(() =>
      useEntityDialog<TestEntity>({
        onDeleteSuccess: mockOnDeleteSuccess,
      })
    );

    act(() => {
      result.current.openEdit(testEntity);
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.handleDeleteSuccess(testEntity.id, testEntity);
    });

    expect(mockOnDeleteSuccess).toHaveBeenCalledWith(testEntity.id, testEntity);
    expect(result.current.isOpen).toBe(false);
  });
});
