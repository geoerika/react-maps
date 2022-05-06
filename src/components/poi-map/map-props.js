import PropTypes from 'prop-types'


export const POIMapProps = {
  mapProps: PropTypes.shape({
    fillColour: PropTypes.array.isRequired,
    polygonFillColour: PropTypes.array.isRequired,
    lineColour: PropTypes.array.isRequired,
    lineWidth: PropTypes.number.isRequired,
    opacity: PropTypes.number.isRequired,
  }),
}

export const POIMapDefaultProps = {
  mapProps: {
    fillColour: [250, 198, 175],
    polygonFillColour: [229, 118, 99],
    polygonLineColour: [212, 62, 52],
    editFillColour:[212, 62, 52],
    editLineColour:[182, 38, 40],
    lineColour: [242, 157, 132],
    lineWidth: 2,
    opacity: 0.2,
  },
}
