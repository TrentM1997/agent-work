export type ChatResponse =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      error: string;
    };
