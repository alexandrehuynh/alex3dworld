// Prop model URLs. Poly Pizza GLBs are bundled; KayKit glTF (+ .bin + texture)
// are served from /public so their relative file references resolve.
import gymMat from "../assets/3d/props/gym_mat.glb";
import gymTreadmill from "../assets/3d/props/gym_treadmill.glb";
import gymDumbbell from "../assets/3d/props/gym_dumbbell.glb";
import officeDesk from "../assets/3d/props/office_desk.glb";
import officeComputer from "../assets/3d/props/office_computer.glb";
import officeMonitor from "../assets/3d/props/office_monitor.glb";
import officeChair from "../assets/3d/props/office_chair.glb";
import officeCorkboard from "../assets/3d/props/office_corkboard.glb";
import plantMonstera from "../assets/3d/props/plant_monstera.glb";
import plantPothos from "../assets/3d/props/plant_pothos.glb";
import cafeCroissant from "../assets/3d/props/cafe_croissant.glb";
import cafeDonut from "../assets/3d/props/cafe_donut.glb";
import cafeMuffin from "../assets/3d/props/cafe_muffin.glb";
import cafeCake from "../assets/3d/props/cafe_cake.glb";
import cafeMug from "../assets/3d/props/cafe_mug.glb";

const kaykit = (pack, name) => `${import.meta.env.BASE_URL}models/kaykit/${pack}/${name}.gltf`;

export const PROPS = {
  gymMat,
  gymTreadmill,
  gymDumbbell,
  officeDesk,
  officeComputer,
  officeMonitor,
  officeChair,
  officeCorkboard,
  plantMonstera,
  plantPothos,
  cafeCroissant,
  cafeDonut,
  cafeMuffin,
  cafeCake,
  cafeMug,
  couch: kaykit("furniture", "couch_pillows"),
  armchair: kaykit("furniture", "armchair_pillows"),
  tableLow: kaykit("furniture", "table_low"),
  tableMedium: kaykit("furniture", "table_medium"),
  chairWood: kaykit("furniture", "chair_A_wood"),
  stool: kaykit("furniture", "chair_stool_wood"),
  rugStripes: kaykit("furniture", "rug_rectangle_stripes_A"),
  rugOval: kaykit("furniture", "rug_oval_A"),
  pictureFrame: kaykit("furniture", "pictureframe_large_A"),
  shelfSmall: kaykit("furniture", "shelf_B_small_decorated"),
  books: kaykit("furniture", "book_set"),
  lamp: kaykit("furniture", "lamp_standing"),
  cactus: kaykit("furniture", "cactus_medium_A"),
  bench: kaykit("city", "bench"),
  streetlight: kaykit("city", "streetlight"),
  bush: kaykit("city", "bush"),
};
