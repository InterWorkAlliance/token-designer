type ArtifactUpdate = {
  action: "editListItem" | "editString" | "add" | "delete";
  type:
    | "alias"
    | "symbol"
    | "businessDescription"
    | "businessExample"
    | "comments"
    | "analogy.name"
    | "analogy.description"
    | "contributor.name"
    | "contributor.organization";
  existing?: string;
  index?: number;
};

export default ArtifactUpdate;
