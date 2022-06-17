const filters = `
 <div class="filters" id="dynamic-rendered">
        <div class="filter">
            <label for="brightness">Brightness </label>
            <input
            type="range"
            id="brightness"
            name="brightness"
            min="0"
            max="200"
            value="100"
            />
            <span>100%</span>
        </div>
        <div class="filter">
            <label for="contrast">Contrast </label>
            <input
            type="range"
            id="contrast"
            name="contrast"
            min="0"
            max="200"
            value="100"
            />
            <span>100%</span>
        </div>
        <div class="filter">
            <label for="saturate">Saturation </label>
            <input
            type="range"
            id="saturate"
            name="saturate"
            min="0"
            max="100"
            value="50"
            />
            <span>50%</span>
        </div>
        <div class="filter">
            <label for="grayscale">Grayscale </label>
            <input
            type="range"
            id="grayscale"
            name="grayscale"
            min="0"
            max="100"
            value="50"
            />
            <span>50%</span>
        </div>
        <div class="filter">
            <label for="sepia">Sepia </label>
            <input
            type="range"
            id="sepia"
            name="sepia"
            min="0"
            max="200"
            value="100"
            />
            <span>100%</span>
        </div>
        <div class="filter">
            <label for="hue-rotate">Hue rotate </label>
            <input
            type="range"
            id="hue-rotate"
            name="hue-rotate"
            min="0"
            max="200"
            value="100"
            />
            <span>100°</span>
        </div>
        <div class="filter">
            <label for="invert">Invert </label>
            <input
            type="range"
            id="invert"
            name="invert"
            min="0"
            max="100"
            value="50"
            />
            <span>50%</span>
        </div>
        <div class="filter">
            <label for="blur">Blur </label>
            <input
            type="range"
            id="blur"
            name="blur"
            min="0"
            max="20"
            value="10"
            />
            <span>10px</span>
        </div>
        <div class="filter">
            <label for="opacity">Opacity </label>
            <input
            type="range"
            id="opacity"
            name="opacity"
            min="0"
            max="100"
            value="50%"
            />
            <span>50%</span>
        </div>
</div>
`;

export default filters;
