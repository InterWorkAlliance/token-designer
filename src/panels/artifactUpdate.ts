type ArtifactUpdate = {
  action: "editListItem" | "editString" | "add" | "addRef" | "delete";
  type:
    | "alias"
    | "symbol"
    | "businessDescription"
    | "businessExample"
    | "comments"
    | "analogy.name"
    | "analogy.description"
    | "contributor.name"
    | "contributor.organization"
    | "dependency"
    | "influencedBy";
  existing?: string;
  index?: number;
};

export default ArtifactUpdate;
