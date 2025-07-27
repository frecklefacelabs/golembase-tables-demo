import { Component } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SqlService } from '../sql';

// Define a type for our parsed JSON results for better type safety.
type ParsedJsonResult = {
  isJson: true;
  data: Record<string, any>;
} | {
  isJson: false;
  data: string;
};

@Component({
  selector: 'app-sql-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import necessary modules for a standalone component
  templateUrl: './sql-terminal.html',
  styleUrls: ['./sql-terminal.css']
})
export class SqlTerminalComponent {
  // The SQL query string, bound to the textarea.
  sqlQuery: string = 'CREATE TABLE users (id INT, name TEXT);\nINSERT INTO users (id, name) VALUES (1, "Alice");\nSELECT * FROM users;';
  
  // An observable to hold the array of result strings.
  results$: Observable<string[]> = of([]);
  isLoading = false;

  constructor(private sqlService: SqlService) {}

  /**
   * Executes the SQL query when the user clicks the submit button.
   */
  onSubmit() {
    if (!this.sqlQuery.trim()) return;
    this.isLoading = true;
    this.results$ = this.sqlService.executeSql(this.sqlQuery).pipe(
      finalize(() => this.isLoading = false) // Set loading to false when done
    );
  }

  /**
   * Parses a single result line to determine if it's a JSON string or a plain message.
   * This is used by the template to decide how to render the line.
   * @param line The result string to parse.
   * @returns A ParsedJsonResult object.
   */
  parseResultLine(line: string): ParsedJsonResult {
    try {
      // Check if it looks like a JSON object before trying to parse.
      if (line.trim().startsWith('{') && line.trim().endsWith('}')) {
        const parsedData = JSON.parse(line);
        return { isJson: true, data: parsedData };
      }
    } catch (e) {
      // Not a valid JSON string, treat as plain text.
    }
    return { isJson: false, data: line };
  }

  /**
   * Custom comparator for the KeyValue pipe to maintain original object order.
   */
  originalOrder = (a: KeyValue<string,any>, b: KeyValue<string,any>): number => {
    return 0;
  }
}
