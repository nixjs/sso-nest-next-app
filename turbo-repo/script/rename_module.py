import glob
import os.path

# get current directory
scriptPath = os.path.dirname(__file__)

# get root monorepo
monorepoPath = os.path.dirname(scriptPath)

# for file in glob.glob(f'{monorepoPath}/**/*', recursive=True):
#     basename = os.path.basename(file)
#     try:
#         if os.path.isfile(file):
#             if basename == "vio68-nextjs-alias-package.json":
#                 os.rename(file, f'{os.path.dirname(file)}/igaming-nextjs-alias-package.json')
#             continue
#
#         if basename == "node_modules":
#             continue
#
#         print(basename)
#         if basename == "vio68":
#             os.rename(file, f'{os.path.dirname(file)}/igaming')
#
#         if basename == "vio68-mobile":
#             os.rename(file, f'{os.path.dirname(file)}/igaming-mobile')
#     except Exception:
#         pass

os.rename(
    f'{monorepoPath}/packages/standard/tsconfig/vio68-nextjs-alias-package.json',
    f'{monorepoPath}/packages/standard/tsconfig/igaming-nextjs-alias-package.json')
os.rename(
    f'{monorepoPath}/packages/vio68',
    f'{monorepoPath}/packages/igaming')

os.rename(
    f'{monorepoPath}/apps/vio68',
    f'{monorepoPath}/apps/igaming')
os.rename(
    f'{monorepoPath}/apps/vio68-mail',
    f'{monorepoPath}/apps/igaming-mail')
os.rename(
    f'{monorepoPath}/apps/vio68-mobile',
    f'{monorepoPath}/apps/igaming-mobile')

for file in glob.glob(f'{monorepoPath}/**/*', recursive=True):
    if not os.path.isfile(file):
        continue

    fileName = os.path.basename(file)
    if fileName == "rename_module.py":
        continue

    print("Processing %s" % file)
    try:
        with open(file) as f:
            renamed_text = f.read()\
                    .replace("@athena20", "@igaming88")\
                    .replace("vio68", "igaming")\
                    .replace("Vio68", "Igaming")\
                    .replace("VIO68", "IGAMING")
        with open(file, "w") as f:
            f.write(renamed_text)
    except Exception:
        pass
