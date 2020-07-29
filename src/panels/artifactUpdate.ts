type ArtifactUpdate = {
  action: "editListItem" | "editString" | "add" | "delete";
  type:
    | "alias"
    | "symbol"
    | "businessDescription"
    | "businessExample"
    | "comments"
    | "analogy.name"
    | "analogy.description";
  existing?: string;
  index?: number;
};

export default ArtifactUpdate;
