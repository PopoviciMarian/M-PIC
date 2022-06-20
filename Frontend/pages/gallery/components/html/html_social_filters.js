const socials = `
<div class="social-auth social-filters">
        <div class="social-item">
          <button class="mpic-btn">MPic</button>
          <div class="mpic-select-container">
            <div class="mpic-select">
              <select name="privacy-select" id="privacy-select">
              <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div class="mpic-search">
              <input id="mpic-search-input" type="search" placeholder="Search..." />
              <!-- <button class="search-btn">Search</button> -->
            </div>
          </div>
          <button class="apply-btn" id="apply-mpic-btn">Apply</button>
        </div>

        <div class="social-item">
          <button class="unsplash-btn">Unsplash</button>
          <div class="unsplash-select">
            <div>
              <label class="container" id="check-my-pics"
                >My pictures
                <input type="checkbox" checked="checked" />
                <span class="checkmark"></span>
              </label>
            </div>
            <div class="radom-container">
              <label for="random">Random </label>
              <input
                id="random-input"
                name="random"
                type="number"
                min="1"
                max="10"
                placeholder="1-10"
              />
            </div>
            <div class="unsplash-search">
              <input id="unsplash-search-input" type="search" placeholder="Search..." />
              <!-- <button class="search-btn">Search</button> -->
            </div>
          </div>
          <button class="apply-btn " id="unsplash-apply-btn">Apply</button>
        </div>

        <div class="social-item">
          <button class="facebook-btn">Facebook</button>
          <!-- <div class="facebook-select"></div> -->
        </div>

        <div class="social-item">
          <button class="twitter-btn" id="twitter-login-btn">Twitter</button>
          <!-- <div class="twitter-select"></div> -->
        </div>

        <!-- <form class="search-box">
          <input
            type="search"
            placeholder="Search..."
            id="site-search"
            name="q"
          />
          <button>Search</button>
        </form> -->
        <!-- <div class="select-wrapper">
          <div class="select-privacy">
            <label for="filters-select-privacy">Privacy</label>
            <select name="filters-select-privacy" id="filters-select-privacy">
              <option value="all">All</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div class="select-social">
            <label for="filters-select-social">Social</label>
            <select name="filters-select-social" id="filters-select-social">
              <option value="all">All</option>
              <option value="unsplash">Unsplash</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>
        </div> -->
      </div>
`;

export default socials;
