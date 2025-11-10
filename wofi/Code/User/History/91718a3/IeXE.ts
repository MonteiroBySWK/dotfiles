async function createPage(title: string, status: string): Promise<Page> {
  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: title } }],
      },
      Status: {
        select: { name: status },
      },
    },
  });
  return response as Page;
}

async function getPages(): Promise<Page[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 50,
  });
  return response.results as Page[];
}

async function updatePage(pageId: string, newTitle: string, newStatus: string): Promise<Page> {
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      Name: { title: [{ text: { content: newTitle } }] },
      Status: { select: { name: newStatus } },
    },
  });
  return response as Page;
}

// DELETE / ARCHIVE
async function archivePage(pageId: string): Promise<Page> {
  const response = await notion.pages.update({
    page_id: pageId,
    archived: true,
  });
  return response as Page;
}