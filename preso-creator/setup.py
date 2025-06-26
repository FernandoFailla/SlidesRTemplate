from setuptools import setup, find_packages
import os

# A helper function to find all template files
def find_template_files(template_dir):
    files = []
    for dirpath, _, filenames in os.walk(template_dir):
        for filename in filenames:
            # Create a path relative to the template_dir's parent
            relative_dir = os.path.relpath(dirpath, 'preso_creator')
            files.append(os.path.join(relative_dir, filename))
    return files

template_files = find_template_files('preso_creator/templates')

setup(
    name='preso-creator',
    version='1.0.0',
    author='AI Software Developer',
    description='A CLI tool to generate a web-based presentation structure.',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    packages=find_packages(),
    package_data={
        'preso_creator': template_files,
    },
    entry_points={
        'console_scripts': [
            'preso-creator=preso_creator.cli:main',
        ],
    },
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.6',
)
