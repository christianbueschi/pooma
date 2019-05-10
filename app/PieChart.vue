<script>
	import {Pie} from 'vue-chartjs';

	export default {
        extends: Pie,
        props: ['data', 'options'],
        mounted() {
	        this.renderChart(this.data.pieData, this.options.pieOptions)
        }
	}
</script>

<style scoped>

</style>