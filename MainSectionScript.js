import { fetchImages } from './js/TopImageSection.js';
import { loadFeatureImages } from './js/featureLoader.js';
import { loadPortfolioImages } from './js/portfolioLoader.js';
import {loadBackgroundImage} from "./js/BackGroundLoader.js";

fetchImages();
loadBackgroundImage();
loadFeatureImages();
loadPortfolioImages();
