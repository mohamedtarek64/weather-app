from pathlib import Path

ROOT = Path(__file__).resolve().parent / ".." / "src"
ROOT = ROOT.resolve()
EXTENSIONS = {".js", ".vue", ".ts", ".css"}


def normalize_file(path: Path) -> None:
  text = path.read_text(encoding="utf-8")
  normalized = text.replace("\r\n", "\n")
  if normalized != text:
    path.write_text(normalized, encoding="utf-8")


def main():
  for file_path in ROOT.rglob("*"):
    if file_path.suffix in EXTENSIONS and file_path.is_file():
      normalize_file(file_path)


if __name__ == "__main__":
  main()
