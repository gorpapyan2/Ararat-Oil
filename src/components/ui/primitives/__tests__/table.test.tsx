import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  TablePrimitive,
  TableHeaderPrimitive,
  TableBodyPrimitive,
  TableFooterPrimitive,
  TableRowPrimitive,
  TableHeadPrimitive,
  TableCellPrimitive,
  TableCaptionPrimitive,
} from '../table';

describe('Table Primitives', () => {
  describe('TablePrimitive', () => {
    it('renders children correctly', () => {
      render(
        <TablePrimitive data-testid="table">
          <tbody>
            <tr>
              <td>Table Content</td>
            </tr>
          </tbody>
        </TablePrimitive>
      );
      
      const table = screen.getByTestId('table');
      expect(table).toHaveTextContent('Table Content');
    });

    it('applies custom classNames', () => {
      render(
        <TablePrimitive data-testid="table" className="custom-class">
          Table Content
        </TablePrimitive>
      );
      
      const table = screen.getByTestId('table');
      expect(table).toHaveClass('custom-class');
    });

    it('forwards additional props', () => {
      render(
        <TablePrimitive data-testid="table" aria-label="Data Table">
          Table Content
        </TablePrimitive>
      );
      
      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('aria-label', 'Data Table');
    });
  });

  describe('TableHeaderPrimitive', () => {
    it('renders children correctly', () => {
      render(
        <TableHeaderPrimitive data-testid="table-header">
          <tr><th>Header Content</th></tr>
        </TableHeaderPrimitive>
      );
      
      const header = screen.getByTestId('table-header');
      expect(header).toHaveTextContent('Header Content');
    });

    it('applies custom classNames', () => {
      render(
        <TableHeaderPrimitive data-testid="table-header" className="custom-header-class">
          Header Content
        </TableHeaderPrimitive>
      );
      
      const header = screen.getByTestId('table-header');
      expect(header).toHaveClass('custom-header-class');
    });
  });

  describe('TableBodyPrimitive', () => {
    it('renders children correctly', () => {
      render(
        <TableBodyPrimitive data-testid="table-body">
          <tr><td>Body Content</td></tr>
        </TableBodyPrimitive>
      );
      
      const body = screen.getByTestId('table-body');
      expect(body).toHaveTextContent('Body Content');
    });

    it('applies custom classNames', () => {
      render(
        <TableBodyPrimitive data-testid="table-body" className="custom-body-class">
          Body Content
        </TableBodyPrimitive>
      );
      
      const body = screen.getByTestId('table-body');
      expect(body).toHaveClass('custom-body-class');
    });
  });

  describe('TableFooterPrimitive', () => {
    it('renders children correctly', () => {
      render(
        <TableFooterPrimitive data-testid="table-footer">
          <tr><td>Footer Content</td></tr>
        </TableFooterPrimitive>
      );
      
      const footer = screen.getByTestId('table-footer');
      expect(footer).toHaveTextContent('Footer Content');
    });

    it('applies custom classNames', () => {
      render(
        <TableFooterPrimitive data-testid="table-footer" className="custom-footer-class">
          Footer Content
        </TableFooterPrimitive>
      );
      
      const footer = screen.getByTestId('table-footer');
      expect(footer).toHaveClass('custom-footer-class');
    });
  });

  describe('TableRowPrimitive', () => {
    it('renders children correctly', () => {
      render(
        <TableRowPrimitive data-testid="table-row">
          <td>Row Content</td>
        </TableRowPrimitive>
      );
      
      const row = screen.getByTestId('table-row');
      expect(row).toHaveTextContent('Row Content');
    });

    it('applies custom classNames', () => {
      render(
        <TableRowPrimitive data-testid="table-row" className="custom-row-class">
          Row Content
        </TableRowPrimitive>
      );
      
      const row = screen.getByTestId('table-row');
      expect(row).toHaveClass('custom-row-class');
    });
  });

  describe('TableHeadPrimitive', () => {
    it('renders children correctly', () => {
      render(
        <TableHeadPrimitive data-testid="table-head">
          Head Content
        </TableHeadPrimitive>
      );
      
      const head = screen.getByTestId('table-head');
      expect(head).toHaveTextContent('Head Content');
    });

    it('applies custom classNames', () => {
      render(
        <TableHeadPrimitive data-testid="table-head" className="custom-head-class">
          Head Content
        </TableHeadPrimitive>
      );
      
      const head = screen.getByTestId('table-head');
      expect(head).toHaveClass('custom-head-class');
    });
  });

  describe('TableCellPrimitive', () => {
    it('renders children correctly', () => {
      render(
        <TableCellPrimitive data-testid="table-cell">
          Cell Content
        </TableCellPrimitive>
      );
      
      const cell = screen.getByTestId('table-cell');
      expect(cell).toHaveTextContent('Cell Content');
    });

    it('applies custom classNames', () => {
      render(
        <TableCellPrimitive data-testid="table-cell" className="custom-cell-class">
          Cell Content
        </TableCellPrimitive>
      );
      
      const cell = screen.getByTestId('table-cell');
      expect(cell).toHaveClass('custom-cell-class');
    });
  });

  describe('TableCaptionPrimitive', () => {
    it('renders children correctly', () => {
      render(
        <TableCaptionPrimitive data-testid="table-caption">
          Caption Content
        </TableCaptionPrimitive>
      );
      
      const caption = screen.getByTestId('table-caption');
      expect(caption).toHaveTextContent('Caption Content');
    });

    it('applies custom classNames', () => {
      render(
        <TableCaptionPrimitive data-testid="table-caption" className="custom-caption-class">
          Caption Content
        </TableCaptionPrimitive>
      );
      
      const caption = screen.getByTestId('table-caption');
      expect(caption).toHaveClass('custom-caption-class');
    });
  });

  describe('Component Composition', () => {
    it('composes all table primitives correctly', () => {
      render(
        <TablePrimitive data-testid="table">
          <TableCaptionPrimitive data-testid="caption">Table Caption</TableCaptionPrimitive>
          <TableHeaderPrimitive data-testid="header">
            <TableRowPrimitive>
              <TableHeadPrimitive data-testid="head">Header 1</TableHeadPrimitive>
              <TableHeadPrimitive>Header 2</TableHeadPrimitive>
            </TableRowPrimitive>
          </TableHeaderPrimitive>
          <TableBodyPrimitive data-testid="body">
            <TableRowPrimitive data-testid="row">
              <TableCellPrimitive data-testid="cell">Cell 1</TableCellPrimitive>
              <TableCellPrimitive>Cell 2</TableCellPrimitive>
            </TableRowPrimitive>
          </TableBodyPrimitive>
          <TableFooterPrimitive data-testid="footer">
            <TableRowPrimitive>
              <TableCellPrimitive>Footer 1</TableCellPrimitive>
              <TableCellPrimitive>Footer 2</TableCellPrimitive>
            </TableRowPrimitive>
          </TableFooterPrimitive>
        </TablePrimitive>
      );
      
      expect(screen.getByTestId('table')).toBeInTheDocument();
      expect(screen.getByTestId('caption')).toHaveTextContent('Table Caption');
      expect(screen.getByTestId('header')).toContainElement(screen.getByTestId('head'));
      expect(screen.getByTestId('head')).toHaveTextContent('Header 1');
      expect(screen.getByTestId('body')).toContainElement(screen.getByTestId('row'));
      expect(screen.getByTestId('row')).toContainElement(screen.getByTestId('cell'));
      expect(screen.getByTestId('cell')).toHaveTextContent('Cell 1');
      expect(screen.getByTestId('footer')).toHaveTextContent('Footer 1');
    });
  });
}); 