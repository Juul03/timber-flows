<script>
  export let fellingDate;
  export let location;
  export let startYear;
  export let endYear;
</script>

<div class="tooltip-content">
  <h4>{location || 'Unknown'}</h4>
  <p><strong>Felling:</strong> {fellingDate || 'n/a'}</p>
  <p><strong>Start:</strong> {startYear || 'n/a'}</p>
  <p><strong>End:</strong> {endYear || 'n/a'}</p>
</div>

<style>
.tooltip-content {
  font-family: system-ui, sans-serif;
  background: white;
  border-radius: 6px;
  padding: 0.5em;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
</style>
