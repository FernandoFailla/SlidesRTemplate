import argparse
from .main import create_presentation

def main():
    parser = argparse.ArgumentParser(
        description="A CLI tool to generate a web-based presentation structure."
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # 'new' command
    new_parser = subparsers.add_parser("new", help="Create a new presentation project.")
    new_parser.add_argument(
        "project_name",
        type=str,
        help="The name of the directory for the new presentation.",
    )

    args = parser.parse_args()

    if args.command == "new":
        create_presentation(args.project_name)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
