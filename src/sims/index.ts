import type { SimMode } from "@/content/lenses";
import { DcfScene } from "./dcf";
import { PackedBedScene } from "./packedBed";
import { ReactorScene } from "./reactor";
import { TestsScene } from "./tests";
import type { Scene } from "./types";

export function createScene(mode: SimMode, flow: "right" | "up" = "right"): Scene {
  switch (mode) {
    case "dcf":
      return new DcfScene();
    case "reactor":
      return new ReactorScene();
    case "tests":
      return new TestsScene();
    default:
      return new PackedBedScene(flow);
  }
}
