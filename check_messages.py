# Read the current file
with open('d:/Studies/DAU/SEM 3/IT643/Project/Jobify/frontend/src/pages/MessagesPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find where the file ends
lines = content.split('\n')
print(f'Current file has {len(lines)} lines')
print('Last 5 lines:')
for l in lines[-5:]:
    print(repr(l))
