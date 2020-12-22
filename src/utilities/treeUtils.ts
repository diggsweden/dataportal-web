import { arrayToTree,Item } from 'performant-array-to-tree'

export interface MenuItemData {
  title: string | undefined;
  value: string | undefined;
  tagPath: string | undefined;  
  urlsegment: string | undefined;
  externalUrl: string | undefined;
  connectedContent: Boolean;
  indexOrder: Number | 0;
}

export interface MenuItem extends Item{
  data : MenuItemData;
  children: MenuItem[] | undefined;
}

/**
 * Create a tree structure of navigation from sent in flat structure
 * 
 * @param data flat data with id and parentId 
 */
export const createNavigationTree= (data:any) => {
  let itemsTree:Item[] = [];

  if(data && data.length > 0)
  {
    data.forEach((m:any) => {
      itemsTree.push({
        id:m.id,
        parentId: m.parentID,        
        title: m.title,
        value: m.value,
        tagPath: m.tagPath,
        indexOrder: m.indexOrder || 0,
        urlsegment: m.connectedTagPath,
        externalUrl: m.externalUrl,
        connectedContent: m.connectedContents && m.connectedContents.length > 0? true : false,        
        children: undefined
      });
    });

    if(itemsTree && itemsTree.length > 0)
    {
      itemsTree.sort((a,b) => parseInt(a.parentId + "0") - parseInt(b.parentId + "0"))    

      var first = itemsTree.find(Boolean);
      
      var root:Item = 
      { 
        id: first?.id, 
        parentId:null,         
        title: first?.title,
        value: first?.value,
        tagPath: first?.tagPath,
        indexOrder: first?.indexOrder || 0,
        externalUrl: first?.externalUrl,
        urlsegment: first?.urlsegment || '',
        connectedContent: first?.connectedContents && first?.connectedContents.length > 0? true : false,    
        children: undefined
      };    
      
      itemsTree[0] = root;
    }
  }

  return arrayToTree(itemsTree) as MenuItem[];
}