/**
 * Registry of Motion pattern pages, keyed by "<categoryId>/<patternId>".
 *
 * To add a motion type: add the category and its patterns to src/data/motion.js
 * for the navigation, then register each pattern's component here. The page
 * component renders only its DocSections and exports a SECTIONS array for the
 * right-hand table of contents.
 */

import SkeletonLoader from './SkeletonLoader'
import CardFlip from './CardFlip'

export const MOTION_PAGES = {
  'loader/skeleton': SkeletonLoader,
  'controls/card-flip': CardFlip,
}
