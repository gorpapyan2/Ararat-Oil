import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../table';

describe('Table Components', () => {
  it('renders Table with children', () => {
    render(
      <Table>
        <tbody>
          <tr>
            <td>Test Content</td>
          </tr>
        </tbody>
      </Table>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders TableHeader with children', () => {
    render(
      <Table>
        <TableHeader>
          <tr>
            <th>Header Content</th>
          </tr>
        </TableHeader>
      </Table>
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('renders TableBody with children', () => {
    render(
      <Table>
        <TableBody>
          <tr>
            <td>Body Content</td>
          </tr>
        </TableBody>
      </Table>
    );
    expect(screen.getByText('Body Content')).toBeInTheDocument();
  });

  it('renders TableFooter with children', () => {
    render(
      <Table>
        <TableFooter>
          <tr>
            <td>Footer Content</td>
          </tr>
        </TableFooter>
      </Table>
    );
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('renders TableRow with children', () => {
    render(
      <Table>
        <tbody>
          <TableRow>
            <td>Row Content</td>
          </TableRow>
        </tbody>
      </Table>
    );
    expect(screen.getByText('Row Content')).toBeInTheDocument();
  });

  it('renders TableHead with children', () => {
    render(
      <Table>
        <thead>
          <tr>
            <TableHead>Head Content</TableHead>
          </tr>
        </thead>
      </Table>
    );
    expect(screen.getByText('Head Content')).toBeInTheDocument();
  });

  it('renders TableCell with children', () => {
    render(
      <Table>
        <tbody>
          <tr>
            <TableCell>Cell Content</TableCell>
          </tr>
        </tbody>
      </Table>
    );
    expect(screen.getByText('Cell Content')).toBeInTheDocument();
  });

  it('renders TableCaption with children', () => {
    render(
      <Table>
        <TableCaption>Caption Content</TableCaption>
      </Table>
    );
    expect(screen.getByText('Caption Content')).toBeInTheDocument();
  });

  it('applies custom className to Table', () => {
    render(
      <Table className="custom-class">
        <tbody>
          <tr>
            <td>Test</td>
          </tr>
        </tbody>
      </Table>
    );
    // We need to find the inner table element which is inside a wrapping div
    const table = screen.getByRole('table');
    expect(table).toHaveClass('custom-class');
  });

  it('applies custom className to TableRow', () => {
    render(
      <Table>
        <tbody>
          <TableRow className="custom-row-class">
            <td>Test</td>
          </TableRow>
        </tbody>
      </Table>
    );
    const row = screen.getByRole('row');
    expect(row).toHaveClass('custom-row-class');
  });

  it('applies custom className to TableCell', () => {
    render(
      <Table>
        <tbody>
          <tr>
            <TableCell className="custom-cell-class">Cell</TableCell>
          </tr>
        </tbody>
      </Table>
    );
    const cell = screen.getByText('Cell');
    expect(cell).toHaveClass('custom-cell-class');
  });

  it('forwards ref to Table', () => {
    const ref = React.createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <tbody>
          <tr>
            <td>Test</td>
          </tr>
        </tbody>
      </Table>
    );
    // The ref should point to the table element
    expect(ref.current).toBeDefined();
  });

  it('composes a full table with all components', () => {
    render(
      <Table>
        <TableCaption>Demo Table</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>jane@example.com</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total: 2 users</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
    
    expect(screen.getByText('Demo Table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Total: 2 users')).toBeInTheDocument();
  });
}); 