import os
import shutil
import sys

def create_presentation(project_name):
    """
    Creates a new presentation directory and populates it with template files.
    """
    # The path to the templates directory within the package
    try:
        # This works for installed packages
        import importlib.resources
        template_path = importlib.resources.files('preso_creator') / 'templates'
    except (ImportError, AttributeError):
        # Fallback for older Python versions or when running from source
        template_path = os.path.join(os.path.dirname(__file__), 'templates')


    # The path for the new project on the user's filesystem
    project_path = os.path.join(os.getcwd(), project_name)

    # Check if the directory already exists
    if os.path.exists(project_path):
        print(f"Error: Directory '{project_name}' already exists.", file=sys.stderr)
        sys.exit(1)

    print(f"Creating new presentation in: {project_path}")

    try:
        # Copy the entire template directory structure
        shutil.copytree(template_path, project_path)
        print("Project created successfully!")
        print(f"\nTo get started, run:\n  cd {project_name}")
        print("Then, open index.html in your browser (preferably from a local server).")

    except Exception as e:
        print(f"An error occurred: {e}", file=sys.stderr)
        # Clean up partially created directory on error
        if os.path.exists(project_path):
            shutil.rmtree(project_path)
        sys.exit(1)
