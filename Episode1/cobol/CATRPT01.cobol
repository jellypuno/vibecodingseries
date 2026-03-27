       IDENTIFICATION DIVISION.
       PROGRAM-ID. CATRPT01.
       AUTHOR. JELLYPUNO.
       DATE-WRITTEN. 2026-03-27.

       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT INFILE ASSIGN TO INFILE.
           SELECT OUTFILE ASSIGN TO OUTFILE.

       DATA DIVISION.
       FILE SECTION.
       FD  INFILE.
       01  INPUT-REC       PIC X(304).

       FD  OUTFILE.
       01  OUTPUT-REC      PIC X(132).

       WORKING-STORAGE SECTION.
       01  WS-EOF          PIC X(1) VALUE 'N'.
       01  WS-LINE-COUNT   PIC 9(5) VALUE ZEROS.
       01  WS-HEADING-1    PIC X(80) VALUE 
           '                     CAT FACTS REPORT                    '.
       01  WS-HEADING-2    PIC X(80) VALUE 
           ' ========================================================='.
       01  WS-HEADING-3    PIC X(80) VALUE
           ' #    LENGTH    FACT                                      '.
       01  WS-HEADING-4    PIC X(80) VALUE 
           ' ---  --------  ------------------------------------------'.
       01  WS-DETAIL-LINE.
           05  WS-REC-NUM   PIC ZZZ9.
           05  FILLER       PIC X(2) VALUE '  '.
           05  WS-FACT-LEN  PIC 9(3).
           05  FILLER       PIC X(2) VALUE '  '.
           05  WS-FACT-TEXT PIC X(60).
       01  WS-BLANK-LINE    PIC X(80) VALUE SPACES.
       01  WS-WORK-REC.
           05  WS-FACT      PIC X(60).
           05  FILLER       PIC X(1) VALUE ','.
           05  WS-LENGTH    PIC X(3).
       01  WS-COUNT        PIC 9(3) VALUE ZEROS.

       PROCEDURE DIVISION.
       MAIN-PARA.
           OPEN INPUT INFILE
           OPEN OUTPUT OUTFILE

           PERFORM WRITE-HEADINGS

           PERFORM READ-INPUT-FILE
               UNTIL WS-EOF = 'Y'

           PERFORM WRITE-TRAILER

           CLOSE INFILE
           CLOSE OUTFILE

           DISPLAY 'REPORT GENERATED SUCCESSFULLY'
           DISPLAY 'TOTAL RECORDS: ' WS-LINE-COUNT

           GOBACK.

       WRITE-HEADINGS.
           MOVE WS-HEADING-1 TO OUTPUT-REC
           WRITE OUTPUT-REC
           MOVE WS-HEADING-2 TO OUTPUT-REC
           WRITE OUTPUT-REC
           MOVE WS-BLANK-LINE TO OUTPUT-REC
           WRITE OUTPUT-REC
           MOVE WS-HEADING-3 TO OUTPUT-REC
           WRITE OUTPUT-REC
           MOVE WS-HEADING-4 TO OUTPUT-REC
           WRITE OUTPUT-REC.

       READ-INPUT-FILE.
           READ INFILE
               AT END
                   MOVE 'Y' TO WS-EOF
               NOT AT END
                   IF INPUT-REC(1:5) = 'FACT,'
                       CONTINUE
                   ELSE
                       MOVE INPUT-REC TO WS-WORK-REC
                       MOVE WS-LENGTH TO WS-FACT-LEN
                       ADD 1 TO WS-LINE-COUNT
                       PERFORM WRITE-DETAIL
                   END-IF
           END-READ.

       WRITE-DETAIL.
           MOVE WS-LINE-COUNT TO WS-REC-NUM
           MOVE WS-FACT TO WS-FACT-TEXT
           MOVE WS-DETAIL-LINE TO OUTPUT-REC
           WRITE OUTPUT-REC.

       WRITE-TRAILER.
           MOVE WS-BLANK-LINE TO OUTPUT-REC
           WRITE OUTPUT-REC
           MOVE WS-HEADING-2 TO OUTPUT-REC
           WRITE OUTPUT-REC
           STRING 'END OF REPORT. TOTAL RECORDS: ' 
                  WS-LINE-COUNT 
           DELIMITED BY SIZE INTO OUTPUT-REC
           WRITE OUTPUT-REC.
